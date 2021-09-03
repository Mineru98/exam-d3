import { useEffect, useRef, useState } from "react";
import { select, line, curveCardinal, axisBottom, scaleLinear, axisRight, scaleBand } from "d3";
import "./App.css";

function App() {
	const svgCircleRef = useRef();
	const svgLineRef = useRef();
	const svgScaleLineRef = useRef();
	const svgAniLineRef = useRef();
	const [data, setData] = useState([25, 30, 45, 60, 20, 65, 75]);

	function circle_func(data) {
		const svg = select(svgCircleRef.current);
		svg.selectAll("circle")
			.data(data)
			.join(
				elm => elm.append("circle").attr("class", "new"),
				update => update.attr("class", "updated"),
				exit => exit.remove()
			)
			.attr("r", val => val)
			.attr("cx", val => val * 2)
			.attr("cy", val => val * 2)
			.attr("stroke", "red");
	}

	function line_func(data) {
		const svg = select(svgLineRef.current);
		const myLine = line()
			.x((val, idx) => idx * 50)
			.y(val => 150 - val)
			.curve(curveCardinal);

		svg.selectAll("path")
			.data([data])
			.join("path")
			.attr("d", val => myLine(val))
			.attr("fill", "none")
			.attr("stroke", "blue");
	}

	function scale_func(data) {
		const svg = select(svgScaleLineRef.current);
		const xScale = scaleLinear()
			.domain([0, data.length - 1])
			.range([0, 300]);
		const yScale = scaleLinear().domain([0, 150]).range([150, 0]);
		const xAxis = axisBottom(xScale)
			.ticks(data.length)
			.tickFormat(idx => idx + 1);
		svg.select(".x-axis").style("transform", "translateY(150px)").call(xAxis);
		const yAxis = axisRight(yScale);
		svg.select(".y-axis").style("transform", "translateX(300px)").call(yAxis);

		const myLine = line()
			.x((val, idx) => xScale(idx))
			.y(yScale)
			.curve(curveCardinal);

		svg.selectAll(".line").data([data]).join("path").attr("class", "line").attr("d", myLine).attr("fill", "none").attr("stroke", "blue");
	}

	function ani_func(data) {
		const svg = select(svgAniLineRef.current);
		const xScale = scaleBand()
			.domain(data.map((val, idx) => idx))
			.range([0, 300])
			.padding(0.5);
		const yScale = scaleLinear().domain([0, 150]).range([150, 0]);
		const colorScale = scaleLinear().domain([0, 75, 125, 150]).range(["green", "orange", "red", "black"]).clamp(true);

		const xAxis = axisBottom(xScale)
			.ticks(data.length)
			.tickFormat(idx => idx + 1);
		svg.select(".x-axis").style("transform", "translateY(150px)").call(xAxis);

		const yAxis = axisRight(yScale);
		svg.select(".y-axis").style("transform", "translateX(300px)").call(yAxis);

		svg.selectAll(".bar")
			.data(data)
			.join("rect")
			.attr("class", "bar")
			.style("transform", "scale(1, -1)")
			.attr("x", (val, idx) => xScale(idx))
			.attr("y", -150)
			.attr("width", xScale.bandwidth())
			.transition()
			.attr("fill", colorScale)
			.attr("height", val => 150 - yScale(val));
	}

	useEffect(() => {
		circle_func(data);
		line_func(data);
		scale_func(data);
		ani_func(data);
	}, [data]);
	return (
		<>
			<svg ref={svgCircleRef} />

			<br />
			<br />

			<svg ref={svgLineRef} />

			<br />
			<br />

			<svg id="s-line" ref={svgScaleLineRef}>
				<g className="x-axis" />
				<g className="y-axis" />
			</svg>

			<br />
			<br />
			<br />

			<svg id="s-line" ref={svgAniLineRef}>
				<g className="x-axis" />
				<g className="y-axis" />
			</svg>

			<br />
			<br />
			<br />

			<button onClick={() => setData([25, 30, 45, 60, 20, 65, 75])}>reset data</button>
			<button onClick={() => setData(data.map(val => val + 5))}>update data</button>
			<button onClick={() => setData(data.filter(val => val < 35))}>Filter data</button>
		</>
	);
}

export default App;
