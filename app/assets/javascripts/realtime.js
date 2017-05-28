/*
 * Creates tooltip with provided id that
 * floats on top of visualization.
 * Most styling is expected to come from CSS
 * so check out bubble_chart.css for more details.
 */
function floatingTooltip(tooltipId, width) {
  // Local variable to hold tooltip div for
  // manipulation in other functions.
  var tt = d3.select('#tooltip')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', tooltipId)
    .style('pointer-events', 'none');

    debugger
  // Set a width if it is provided.
  if (width) {
    tt.style('width', width);
  }

  // Initially it is hidden.
  hideTooltip();

  /*
   * Display tooltip with provided content.
   *
   * content is expected to be HTML string.
   *
   * event is d3.event for positioning.
   */
  function showTooltip(content, event) {
    tt.style('opacity', 1.0)
      .html(content);

    updatePosition(event);
  }

  /*
   * Hide the tooltip div.
   */
  function hideTooltip() {
    tt.style('opacity', 0.0);
  }

  /*
   * Figure out where to place the tooltip
   * based on d3 mouse event.
   */
  function updatePosition(event) {
    var xOffset = 20;
    var yOffset = 10;

    var ttw = tt.style('width');
    var tth = tt.style('height');

    var wscrY = window.scrollY;
    var wscrX = window.scrollX;

    var curX = (document.all) ? event.clientX + wscrX : event.pageX;
    var curY = (document.all) ? event.clientY + wscrY : event.pageY;
    var ttleft = ((curX - wscrX + xOffset * 2 + ttw) > window.innerWidth) ?
                 curX - ttw - xOffset * 2 : curX + xOffset;

    if (ttleft < wscrX + xOffset) {
      ttleft = wscrX + xOffset;
    }

    var tttop = ((curY - wscrY + yOffset * 2 + tth) > window.innerHeight) ?
                curY - tth - yOffset * 2 : curY + yOffset;

    if (tttop < wscrY + yOffset) {
      tttop = curY + yOffset;
    }

    tt.style({ top: tttop + 'px', left: ttleft + 'px' });
  }

  return {
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    updatePosition: updatePosition
  };
}

function bubbleChart() {
  var width = 1300;
  var height = 600;

  var tooltip = null;
  var center = { x: width / 2, y: height / 2 };

  var roomCenter = {
    2: { x: 300, y: height / 2 },
    3: { x: 450, y: height / 2 },
    4: { x: 600, y: height / 2 },
    5: { x: 750, y: height / 2 },
    6: { x: 900, y: height / 2 },
    7: { x: 1050, y: height / 2 }
  };

  var roomTitleX = {
    2: 150,
    3: 350,
    4: 550,
    5: 780,
    6: 1000,
    7: 1250
  };

  var roomTitle = {
    2: "2do",
    3: "3ro",
    4: "4to",
    5: "5to",
    6: "6to",
    7: "7mo"
  }

  var roleCenter = {
    developer: { x: 300, y: height / 2 },
    QA: { x: 450, y: height / 2 },
    sales: { x: 600, y: height / 2 },
    design: { x: 750, y: height / 2 },
    comunication: { x: 900, y: height / 2 },
    administration: { x: 1050, y: height / 2 },
    rrhh: { x: 1200, y: height / 2 }
  };

  var roleTitleX = {
    developer: 200,
    qa: 470,
    sales: 615,
    design: 820,
    comunication: 1000,
    administration: 1200,
    rrhh: 1350
  }

  var damper = 0.102;

  var svg = null;
  var bubbles = null;
  var nodes = [];

  function charge(d) {
    return -Math.pow(d.radius, 2.0) / 8;
  }

  var force = d3.layout.force()
    .size([width, height])
    .charge(charge)
    .gravity(-0.01)
    .friction(0.9);

  var fillColor = d3.scale.ordinal()
    .domain(['developer', 'design', 'rrhh', 'sales', 'comunication', 'administration', 'QA'])
    .range(['#5082E4', '#68BE5F', '#FF5867', '#FF794D', '#BE5FB6', '#3DCCCC', '#554471']);

  var radiusScale = d3.scale.pow()
    .exponent(0.5)
    .range([0, 30]);

  function createNodes(rawData) {
    var myNodes = rawData.map(function (d) {
      return {
        id: d.id,
        radius: radiusScale(+d.hours),
        room: d.room,
        role: d.role,
        hours: d.hours,
        x: Math.random() * 900,
        y: Math.random() * 800
      };
    });
    myNodes.sort(function (a, b) { return b.hours - a.hours; });

    return myNodes;
  }

  var chart = function chart(selector, rawData) {
    var maxAmount = d3.max(rawData, function (d) { return +d.hours; });
    radiusScale.domain([0, maxAmount]);
    nodes = createNodes(rawData);

    force.nodes(nodes);
    svg = d3.select(selector)
      .append('svg')
      .attr('width', width + 200)
      .attr('height', height);


    bubbles = svg.selectAll('.bubble')
      .data(nodes, function (d) { return d.id; });

    bubbles.enter().append('circle')
      .classed('bubble', true)
      .attr('r', 0)
      .attr('fill', function (d) { return fillColor(d.role); })
      .on('mouseover', showDetail)
      .on('mouseout', hideDetail);

    bubbles.transition()
      .duration(2000)
      .attr('r', function (d) { return d.radius; });

    groupBubbles();
  };

  function groupBubbles() {
    hideRooms();
    hideRoles();

    force.on('tick', function (e) {
      bubbles.each(moveToCenter(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }

  function moveToCenter(alpha) {
    return function (d) {
      d.x = d.x + (center.x - d.x) * damper * alpha;
      d.y = d.y + (center.y - d.y) * damper * alpha;
    };
  }

  function splitInRooms() {
    showRooms();
    hideRoles();

    force.on('tick', function (e) {
      bubbles.each(moveToRoom(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }

  function moveToRoom(alpha) {
    return function (d) {
      var target = roomCenter[d.room];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  function hideRooms() {
    svg.selectAll('.room').remove();
  }

  function showRooms() {
    var roomsData = d3.keys(roomTitleX);
    var rooms = svg.selectAll('.room')
      .data(roomsData);

    rooms.enter().append('text')
      .attr('class', 'room')
      .attr('x', function (d) { return roomTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return roomTitle[d]; });
  }

  function splitInRoles() {
    showRoles();
    hideRooms();

    force.on('tick', function (e) {
      bubbles.each(moveToRoles(e.alpha))
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });
    });

    force.start();
  }

  function moveToRoles(alpha) {
    return function (d) {
      var target = roleCenter[d.role];
      d.x = d.x + (target.x - d.x) * damper * alpha * 1.1;
      d.y = d.y + (target.y - d.y) * damper * alpha * 1.1;
    };
  }

  function hideRoles() {
    svg.selectAll('.role').remove();
  }

  function showRoles() {
    var rolesData = d3.keys(roleTitleX);
    var roles = svg.selectAll('.role')
      .data(rolesData);

    roles.enter().append('text')
      .attr('class', 'role')
      .attr('x', function (d) { return roleTitleX[d]; })
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text(function (d) { return d.toUpperCase(); });
  }

  function showDetail(d) {
    d3.select(this)
      .attr('stroke', d3.rgb(fillColor(d.group)).darker());

    var content = '<span class="name">Role: </span><span class="value" style="color:' + fillColor(d.role) + '">' +
                  d.role.toUpperCase() +
                  '</span><br/>' +
                  '<span class="name">Hours in office: </span><span class="value">' +
                  d.hours +
                  '</span><br/>' +
                  '<span class="name">Room: </span><span class="value">' +
                  d.room +
                  '</span>';
    if (!tooltip) {
      tooltip = floatingTooltip('gates_tooltip', 240);
    }
    tooltip.showTooltip(content, d3.event);
  }

  function hideDetail(d) {
    d3.select(this)
      .attr('stroke', "none");

    tooltip.hideTooltip();
  }

  chart.toggleDisplay = function (displayName) {
    if (displayName === 'room') {
      splitInRooms();
    } else if(displayName === 'role') {
      splitInRoles();
    } else {
      groupBubbles();
    }
  };
  return chart;
}

var myBubbleChart = bubbleChart();

function display(data) {
  myBubbleChart('#vis', data);
}

function setupButtons() {
  d3.select('#toolbar')
    .selectAll('.button')
    .on('click', function () {
      // Remove active class from all buttons
      d3.selectAll('.button').classed('active', false);
      // Find the button just clicked
      var button = d3.select(this);

      // Set it as the active button
      button.classed('active', true);

      // Get the id of the button
      var buttonId = button.attr('id');

      // Toggle the bubble chart based on
      // the currently clicked button.
      myBubbleChart.toggleDisplay(buttonId);
    });
}

const data = [
  {
    "id": 1,
    "role": "developer",
    "hours": 8,
    "room": 7
  },
  {
    "id": 2,
    "role": "developer",
    "hours": 4,
    "room": 7
  },
  {
    "id": 3,
    "role": "developer",
    "hours": 8,
    "room": 7
  },
  {
    "id": 4,
    "role": "developer",
    "hours": 1,
    "room": 7
  },
  {
    "id": 5,
    "role": "developer",
    "hours": 8,
    "room": 7
  },
  {
    "id": 6,
    "role": "developer",
    "hours": 8,
    "room": 7
  },
  {
    "id": 7,
    "role": "developer",
    "hours": 1,
    "room": 7
  },
  {
    "id": 8,
    "role": "developer",
    "hours": 1,
    "room": 2
  },
  {
    "id": 9,
    "role": "developer",
    "hours": 8,
    "room": 2
  },
  {
    "id": 10,
    "role": "developer",
    "hours": 3,
    "room": 2
  },
  {
    "id": 11,
    "role": "developer",
    "hours": 8,
    "room": 2
  },
  {
    "id": 12,
    "role": "developer",
    "hours": 8,
    "room": 2
  },
  {
    "id": 13,
    "role": "developer",
    "hours": 2,
    "room": 7
  },
  {
    "id": 14,
    "role": "developer",
    "hours": 2,
    "room": 2
  },
  {
    "id": 15,
    "role": "developer",
    "hours": 4,
    "room": 2
  },
  {
    "id": 16,
    "role": "developer",
    "hours": 8,
    "room": 2
  },
  {
    "id": 17,
    "role": "developer",
    "hours": 8,
    "room": 2
  },
  {
    "id": 18,
    "role": "developer",
    "hours": 8,
    "room": 2
  },
  {
    "id": 19,
    "role": "developer",
    "hours": 3,
    "room": 2
  },
  {
    "id": 20,
    "role": "developer",
    "hours": 8,
    "room": 2
  },
  {
    "id": 21,
    "role": "developer",
    "hours": 8,
    "room": 3
  },
  {
    "id": 22,
    "role": "developer",
    "hours": 8,
    "room": 3
  },
  {
    "id": 23,
    "role": "developer",
    "hours": 8,
    "room": 2
  },
  {
    "id": 24,
    "role": "developer",
    "hours": 8,
    "room": 2
  },
  {
    "id": 25,
    "role": "developer",
    "hours": 2,
    "room": 3
  },
  {
    "id": 26,
    "role": "developer",
    "hours": 8,
    "room": 3
  },
  {
    "id": 27,
    "role": "developer",
    "hours": 8,
    "room": 3
  },
  {
    "id": 28,
    "role": "developer",
    "hours": 4,
    "room": 3
  },
  {
    "id": 29,
    "role": "developer",
    "hours": 8,
    "room": 3
  },
  {
    "id": 30,
    "role": "developer",
    "hours": 8,
    "room": 3
  },
  {
    "id": 31,
    "role": "developer",
    "hours": 8,
    "room": 3
  },
  {
    "id": 32,
    "role": "developer",
    "hours": 1,
    "room": 4
  },
  {
    "id": 33,
    "role": "developer",
    "hours": 1,
    "room": 4
  },
  {
    "id": 34,
    "role": "developer",
    "hours": 8,
    "room": 4
  },
  {
    "id": 35,
    "role": "developer",
    "hours": 8,
    "room": 4
  },
  {
    "id": 36,
    "role": "developer",
    "hours": 2,
    "room": 4
  },
  {
    "id": 37,
    "role": "developer",
    "hours": 8,
    "room": 4
  },
  {
    "id": 38,
    "role": "developer",
    "hours": 8,
    "room": 4
  },
  {
    "id": 39,
    "role": "developer",
    "hours": 8,
    "room": 4
  },
  {
    "id": 40,
    "role": "developer",
    "hours": 4,
    "room": 4
  },
  {
    "id": 41,
    "role": "developer",
    "hours": 8,
    "room": 4
  },
  {
    "id": 42,
    "role": "developer",
    "hours": 7,
    "room": 4
  },
  {
    "id": 43,
    "role": "developer",
    "hours": 4,
    "room": 4
  },
  {
    "id": 44,
    "role": "developer",
    "hours": 3,
    "room": 4
  },
  {
    "id": 45,
    "role": "developer",
    "hours": 8,
    "room": 5
  },
  {
    "id": 46,
    "role": "developer",
    "hours": 2,
    "room": 5
  },
  {
    "id": 47,
    "role": "developer",
    "hours": 8,
    "room": 5
  },
  {
    "id": 48,
    "role": "developer",
    "hours": 8,
    "room": 5
  },
  {
    "id": 49,
    "role": "developer",
    "hours": 3,
    "room": 5
  },
  {
    "id": 50,
    "role": "developer",
    "hours": 8,
    "room": 5
  },
  {
    "id": 51,
    "role": "developer",
    "hours": 4,
    "room": 5
  },
  {
    "id": 52,
    "role": "developer",
    "hours": 8,
    "room": 6
  },
  {
    "id": 53,
    "role": "developer",
    "hours": 6,
    "room": 6
  },
  {
    "id": 54,
    "role": "developer",
    "hours": 7,
    "room": 6
  },
  {
    "id": 55,
    "role": "developer",
    "hours": 3,
    "room": 6
  },
  {
    "id": 56,
    "role": "developer",
    "hours": 4,
    "room": 6
  },
  {
    "id": 57,
    "role": "developer",
    "hours": 4,
    "room": 6
  },
  {
    "id": 58,
    "role": "developer",
    "hours": 4,
    "room": 6
  },
  {
    "id": 59,
    "role": "developer",
    "hours": 4,
    "room": 6
  },
  {
    "id": 60,
    "role": "developer",
    "hours": 3,
    "room": 6
  },
  {
    "id": 61,
    "role": "developer",
    "hours": 2,
    "room": 6
  },
  {
    "id": 62,
    "role": "developer",
    "hours": 1,
    "room": 6
  },
  {
    "id": 63,
    "role": "design",
    "hours": 8,
    "room": 6
  },
  {
    "id": 64,
    "role": "design",
    "hours": 8,
    "room": 6
  },
  {
    "id": 65,
    "role": "design",
    "hours": 8,
    "room": 5
  },
  {
    "id": 66,
    "role": "design",
    "hours": 8,
    "room": 4
  },
  {
    "id": 67,
    "role": "design",
    "hours": 8,
    "room": 5
  },
  {
    "id": 68,
    "role": "design",
    "hours": 8,
    "room": 4
  },
  {
    "id": 69,
    "role": "design",
    "hours": 8,
    "room": 4
  },
  {
    "id": 70,
    "role": "design",
    "hours": 8,
    "room": 4
  },
  {
    "id": 71,
    "role": "design",
    "hours": 8,
    "room": 4
  },
  {
    "id": 72,
    "role": "design",
    "hours": 8,
    "room": 4
  },
  {
    "id": 73,
    "role": "design",
    "hours": 8,
    "room": 5
  },
  {
    "id": 74,
    "role": "design",
    "hours": 8,
    "room": 6
  },
  {
    "id": 75,
    "role": "design",
    "hours": 4,
    "room": 6
  },
  {
    "id": 76,
    "role": "design",
    "hours": 5,
    "room": 6
  },
  {
    "id": 77,
    "role": "QA",
    "hours": 3,
    "room": 6
  },
  {
    "id": 78,
    "role": "QA",
    "hours": 2,
    "room": 6
  },
  {
    "id": 79,
    "role": "QA",
    "hours": 8,
    "room": 5
  },
  {
    "id": 80,
    "role": "QA",
    "hours": 8,
    "room": 5
  },
  {
    "id": 81,
    "role": "QA",
    "hours": 2,
    "room": 6
  },
  {
    "id": 82,
    "role": "sales",
    "hours": 8,
    "room": 3
  },
  {
    "id": 83,
    "role": "sales",
    "hours": 8,
    "room": 6
  },
  {
    "id": 84,
    "role": "sales",
    "hours": 8,
    "room": 6
  },
  {
    "id": 85,
    "role": "sales",
    "hours": 8,
    "room": 3
  },
  {
    "id": 86,
    "role": "sales",
    "hours": 8,
    "room": 4
  },
  {
    "id": 87,
    "role": "sales",
    "hours": 8,
    "room": 4
  },
  {
    "id": 88,
    "role": "sales",
    "hours": 8,
    "room": 4
  },
  {
    "id": 89,
    "role": "sales",
    "hours": 8,
    "room": 5
  },
  {
    "id": 90,
    "role": "rrhh",
    "hours": 8,
    "room": 6
  },
  {
    "id": 91,
    "role": "rrhh",
    "hours": 8,
    "room": 6
  },
  {
    "id": 92,
    "role": "rrhh",
    "hours": 8,
    "room": 6
  },
  {
    "id": 93,
    "role": "comunication",
    "hours": 8,
    "room": 5
  },
  {
    "id": 94,
    "role": "comunication",
    "hours": 8,
    "room": 5
  },
  {
    "id": 95,
    "role": "comunication",
    "hours": 8,
    "room": 6
  },
  {
    "id": 96,
    "role": "comunication",
    "hours": 8,
    "room": 6
  },
  {
    "id": 97,
    "role": "comunication",
    "hours": 8,
    "room": 6
  },
  {
    "id": 98,
    "role": "administration",
    "hours": 8,
    "room": 6
  },
  {
    "id": 99,
    "role": "administration",
    "hours": 8,
    "room": 6
  }
]

load({
  controllers: {
    stats: ['index']
  }
}, (controller, action) => {
  display(data)
  setupButtons();
})
