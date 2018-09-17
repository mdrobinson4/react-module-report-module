function PiePlot(CatVar,viewNum=100,DivPos='myDiv'){
	var SumStat=summaryCategorical(CatVar,viewNum)
	var data = [
  		{
    			values: SumStat['LabelCount'],
    			labels: SumStat['UniqueLabel'],
    			type: 'pie'
 			 }
	];
	Plotly.newPlot(DivPos,data);
}
