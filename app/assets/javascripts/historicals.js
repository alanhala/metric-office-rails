


load({
  controllers: {
    historicals: ['index']
  }
}, (controller, action) => {
  var floorRingChart   = dc.pieChart("#chart-ring-year"),
      hourQuantityIdHistogram  = dc.barChart("#chart-hist-hour"),
      spenderRowChart = dc.rowChart("#chart-row-spenders"),
      rolesRowChart = dc.rowChart("#chart-row-roles"),
      volumeChart = dc.barChart('#monthly-volume-chart');

  var employees = [
      {macAddress: '1', Name: 'Developer', Piso: '2', Fecha: '11/11/2016', Hora: '17', Day: 'Lunes'},
      {macAddress: '1', Name: 'Developer', Piso: '2', Fecha: '11/11/2016', Hora: '17', Day: 'Lunes'},
      {macAddress: '2', Name: 'Developer', Piso: '2', Fecha: '11/11/2016', Hora: '10', Day: 'Lunes'},
      {macAddress: '3', Name: 'Developer', Piso: '2', Fecha: '11/11/2016', Hora: '11', Day: 'Lunes'},
      {macAddress: '4', Name: 'Developer', Piso: '2', Fecha: '11/11/2016', Hora: '12', Day: 'Lunes'},
      {macAddress: '5', Name: 'RRHH', Piso: '4', Fecha: '11/11/2016', Hora: '13', Day: 'Lunes'},
      {macAddress: '6', Name: 'RRHH', Piso: '4', Fecha: '11/11/2016', Hora: '13', Day: 'Lunes'},
      {macAddress: '7', Name: 'RRHH', Piso: '4', Fecha: '11/11/2016', Hora: '13', Day: 'Martes'},
      {macAddress: '8', Name: 'Sales', Piso: '5', Fecha: '11/11/2016', Hora: '12', Day: 'Martes'},
      {macAddress: '9', Name: 'Sales', Piso: '6', Fecha: '11/11/2016', Hora: '12', Day: 'Martes'},
      {macAddress: '10', Name: 'Sales', Piso: '7', Fecha: '11/12/2016', Hora: '12', Day: 'Martes'},
      {macAddress: '12', Name: 'Sales', Piso: '7', Fecha: '12/12/2016', Hora: '12', Day: 'Lunes'},
      {macAddress: '12', Name: 'Design', Piso: '2', Fecha: '12/12/2016', Hora: '12', Day: 'Lunes'},
      {macAddress: '12', Name: 'Design', Piso: '5', Fecha: '12/12/2016', Hora: '12', Day: 'Martes'},
      {macAddress: '3', Name: 'Developer', Piso: '2', Fecha: '12/12/2016', Hora: '9', Day: 'Lunes'},
      {macAddress: '4', Name: 'Developer', Piso: '2', Fecha: '12/12/2016', Hora: '10', Day: 'Lunes'},
      {macAddress: '5', Name: 'RRHH', Piso: '4', Fecha: '12/12/2016', Hora: '12', Day: 'Lunes'},
      {macAddress: '6', Name: 'RRHH', Piso: '3', Fecha: '12/12/2016', Hora: '13', Day: 'Lunes'},
      {macAddress: '7', Name: 'Administration', Piso: '4', Fecha: '12/12/2016', Hora: '14', Day: 'Martes'},
      {macAddress: '8', Name: 'Sales', Piso: '5', Fecha: '12/12/2016', Hora: '15', Day: 'Viernes'},
      {macAddress: '9', Name: 'Sales', Piso: '6', Fecha: '11/11/2016', Hora: '17', Day: 'Martes'},
      {macAddress: '10', Name: 'Sales', Piso: '7', Fecha: '11/11/2016', Hora: '17', Day: 'Martes'},
      {macAddress: '11', Name: 'Comunication', Piso: '7', Fecha: '11/11/2016', Hora: '17', Day: 'Lunes'},
      {macAddress: '12', Name: 'Design', Piso: '2', Fecha: '11/11/2016', Hora: '18', Day: 'Lunes'},
      {macAddress: '12', Name: 'Design', Piso: '5', Fecha: '11/11/2016', Hora: '17', Day: 'Martes'},
      {macAddress: '6', Name: 'RRHH', Piso: '3', Fecha: '11/11/2016', Hora: '13', Day: 'Miercoles'},
      {macAddress: '7', Name: 'RRHH', Piso: '3', Fecha: '11/11/2016', Hora: '13', Day: 'Viernes'},
      {macAddress: '8', Name: 'Sales', Piso: '3', Fecha: '11/11/2016', Hora: '12', Day: 'Martes'},
      {macAddress: '9', Name: 'Comunication', Piso: '6', Fecha: '11/11/2016', Hora: '16', Day: 'Martes'},
      {macAddress: '10', Name: 'Sales', Piso: '7', Fecha: '11/11/2016', Hora: '14', Day: 'Jueves'},
      {macAddress: '11', Name: 'Sales', Piso: '7', Fecha: '11/11/2016', Hora: '14', Day: 'Miercoles'},
      {macAddress: '12', Name: 'Design', Piso: '2', Fecha: '11/11/2016', Hora: '14', Day: 'Miercoles'},
      {macAddress: '12', Name: 'Comunication', Piso: '5', Fecha: '11/11/2016', Hora: '15', Day: 'Jueves'},
      {macAddress: '3', Name: 'Developer', Piso: '2', Fecha: '11/11/2016', Hora: '16', Day: 'Miercoles'},
      {macAddress: '4', Name: 'Developer', Piso: '2', Fecha: '11/11/2016', Hora: '16', Day: 'Viernes'},
      {macAddress: '5', Name: 'RRHH', Piso: '4', Fecha: '11/11/2016', Hora: '11', Day: 'Miercoles'},
      {macAddress: '6', Name: 'RRHH', Piso: '4', Fecha: '11/11/2016', Hora: '13', Day: 'Lunes'},
      {macAddress: '7', Name: 'RRHH', Piso: '4', Fecha: '11/11/2016', Hora: '14', Day: 'Jueves'},
      {macAddress: '8', Name: 'Sales', Piso: '5', Fecha: '11/11/2016', Hora: '15', Day: 'Jueves'},
      {macAddress: '9', Name: 'Sales', Piso: '6', Fecha: '11/11/2016', Hora: '17', Day: 'Jueves'},
      {macAddress: '10', Name: 'QA', Piso: '7', Fecha: '11/11/2016', Hora: '17', Day: 'Jueves'},
      {macAddress: '11', Name: 'QA', Piso: '7', Fecha: '11/11/2016', Hora: '17', Day: 'Lunes'},
      {macAddress: '12', Name: 'Design', Piso: '2', Fecha: '11/11/2016', Hora: '18', Day: 'Lunes'},
      {macAddress: '12', Name: 'Design', Piso: '5', Fecha: '11/11/2016', Hora: '17', Day: 'Viernes'}

  ];

  /*
  	What is a dimension?

  	Constructs a new dimension using the specified value accessor function. The function must return naturally-ordered values, i.e., values that behave correctly with respect to JavaScript's <, <=, >= and > operators. This typically means primitives: booleans, numbers or strings; however, you can override object.valueOf to provide a comparable value from a given object, such as a Date.
  */

  var dateFormat = d3.time.format('%d/%m/%Y');

  employees.forEach(function (d) {
      d.Fecha = dateFormat.parse(d.Fecha);
      d.month = d3.time.month(d.Fecha);
  });

  var roleColorScale = d3.scale.ordinal()
                                .domain(['Developer', 'Design', 'RRHH', 'Sales', 'Comunication', 'Administration', 'QA'])
                                .range(['#5082E4', '#68BE5F', '#FF5867', '#FF794D', '#BE5FB6', '#3DCCCC', '#554471']);

  var floorColorScale = d3.scale.ordinal()
                                .domain(['2', '3', '4', '5', '6', '7'])
                                .range(['#5082E4', '#68BE5F', '#FF5867', '#FF794D', '#BE5FB6', '#3DCCCC']);

  var dayColorScale = d3.scale.ordinal()
                                .domain(['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'])
                                .range(['#5082E4', '#68BE5F', '#FF5867', '#FF794D', '#BE5FB6']);


  var ndx = crossfilter(employees),
      floorDim = ndx.dimension(function(d) {return d.Piso} )
      yearDim  = ndx.dimension(function(d) {return d.Fecha;}),
      hourDim = ndx.dimension(function(d) {return parseInt(d.Hora);}),
      dayDim = ndx.dimension(function(d) {return d.Day;}),
      nameDim  = ndx.dimension(function(d) {return d.Name;}),
      monthlyDimension = ndx.dimension(function (d) { return d.month;}),
      rolePerFloor = floorDim.group().reduceCount(function(d) {return d.Name;}),
      dayReturn = dayDim.group().reduceCount(),
      timeInFloor = hourDim.group().reduceCount(function(d) {return d.macAddress;}),
      roleGroup = nameDim.group().reduceCount(),
      volumeByMonthGroup = monthlyDimension.group().reduceCount();
      ;

  /*
      # group.reduceSum(value)
  		A convenience method for setting the reduce functions to sum records using the specified value accessor function; returns this group. For example, to group payments by type and sum by total:
  */
  floorRingChart
      .width(500).height(300)
      .dimension(floorDim)
      .group(rolePerFloor)
      .innerRadius(40)
      .colors(function(d) {return floorColorScale(d)});

  hourQuantityIdHistogram
      .width(500).height(300)
      .dimension(hourDim)
      .group(timeInFloor)
      .x(d3.scale.ordinal())
      .xUnits(dc.units.ordinal)
      .elasticX(true)
      .elasticY(true)
      .colors(function(d) {return "#5082E4"});;

  hourQuantityIdHistogram.xAxis().tickFormat(function(d) {return d});
  hourQuantityIdHistogram.yAxis().ticks(2);

  spenderRowChart
      .width(500).height(300)
      .dimension(dayDim)
      .group(dayReturn)
      .elasticX(true)
      .colors(function(d) {return dayColorScale(d);});

  rolesRowChart
      .width(500).height(300)
      .dimension(nameDim)
      .group(roleGroup)
      .elasticX(true)
      .colors(function(d) {return roleColorScale(d)});

  volumeChart.width(1500)
      .height(70)
      .margins({top: 20, right: 200, bottom: 20, left: 200})
      .dimension(monthlyDimension)
      .group(volumeByMonthGroup)
      .centerBar(true)
      .gap(1)
      .colors(function(d) {return "#5082E4"})
      .x(d3.time.scale().domain([new Date(2016, 09, 10), new Date(2017, 04, 19)]))
      .round(d3.time.month.round)
      .alwaysUseRounding(true)
      .xUnits(d3.time.months)
      .yAxis().ticks(0);

  dc.renderAll();
})
