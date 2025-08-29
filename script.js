// Quiz logic for multiple questions
document.addEventListener('DOMContentLoaded', function () {
	const quizForm = document.getElementById('quiz-form');
	const resultArea = document.getElementById('result-area');
	const questionArea = document.getElementById('question-area');
	const prevBtn = document.getElementById('prev-btn');
	const nextBtn = document.getElementById('next-btn');

	// Quiz state
	let currentQuestion = 0;
	let answers = [null, null, null, null];

	// Question data
	const questions = [
		{
			type: 'slope',
			text: 'Find the slope of the line passing through the points (2, 3) and (5, 11).',
			points: [[2, 3], [5, 11]],
		},
		{
			type: 'point-on-line',
			text: 'Is the point (4, 9) on the line y = 2x + 1? Answer Yes or No.',
			line: { m: 2, b: 1 },
			point: [4, 9],
		},
		{
			type: 'eq-point-on-line',
			text: 'Is the point (3, -2) on the line 2x - y = 8? Answer Yes or No.',
			equation: { a: 2, b: -1, c: 8 }, // 2x - y = 8
			point: [3, -2],
		},
		{
			type: 'slope-type',
			text: 'What is the slope of the line shown below?',
			line: { m: 0, b: 4 }, // y = 4
		}
	];

	function renderQuestion() {
		resultArea.innerHTML = '';
		questionArea.innerHTML = '';
		if (currentQuestion === 0) {
			// Slope question
			questionArea.innerHTML = `
				<h2>Question 1</h2>
				<p>${questions[0].text}</p>
				<label for="slope">Slope (fraction or decimal):</label>
				<input type="text" id="slope" name="slope" autocomplete="off" value="${answers[0] !== null ? answers[0] : ''}">
			`;
		} else if (currentQuestion === 1) {
			// Point on line question
			questionArea.innerHTML = `
				<h2>Question 2</h2>
				<p>${questions[1].text}</p>
				<canvas id="graph-canvas" width="300" height="300" style="border:1px solid #333;"></canvas>
				<label for="point-on-line">Is the point on the line?</label>
				<select id="point-on-line" name="point-on-line">
					<option value="">Select</option>
					<option value="Yes" ${answers[1]==='Yes'?'selected':''}>Yes</option>
					<option value="No" ${answers[1]==='No'?'selected':''}>No</option>
				</select>
			`;
			drawGraph(1);
		} else if (currentQuestion === 2) {
			// Equation and point question
			questionArea.innerHTML = `
				<h2>Question 3</h2>
				<p>${questions[2].text}</p>
				<label for="eq-point-on-line">Is the point on the line?</label>
				<select id="eq-point-on-line" name="eq-point-on-line">
					<option value="">Select</option>
					<option value="Yes" ${answers[2]==='Yes'?'selected':''}>Yes</option>
					<option value="No" ${answers[2]==='No'?'selected':''}>No</option>
				</select>
			`;
		} else if (currentQuestion === 3) {
			// Slope type question
			questionArea.innerHTML = `
				<h2>Question 4</h2>
				<p>${questions[3].text}</p>
				<canvas id="graph-canvas" width="300" height="300" style="border:1px solid #333;"></canvas>
				<label for="slope-type">Slope:</label>
				<select id="slope-type" name="slope-type">
					<option value="">Select</option>
					<option value="Positive" ${answers[3]==='Positive'?'selected':''}>Positive</option>
					<option value="Negative" ${answers[3]==='Negative'?'selected':''}>Negative</option>
					<option value="Zero" ${answers[3]==='Zero'?'selected':''}>Zero</option>
					<option value="Undefined" ${answers[3]==='Undefined'?'selected':''}>Undefined</option>
				</select>
			`;
			drawGraph(3);
		}
		prevBtn.disabled = currentQuestion === 0;
		nextBtn.disabled = currentQuestion === questions.length - 1;
	}

	function drawGraph(questionIdx) {
		const canvas = document.getElementById('graph-canvas');
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Set up scale for -10 to 10
		const min = -10, max = 10;
		const size = canvas.width; // 300
		const step = size / (max - min); // 15 px per unit

		// Draw grid
		ctx.strokeStyle = '#ccc';
		for (let i = min; i <= max; i++) {
			// Vertical lines
			ctx.beginPath();
			ctx.moveTo((i - min) * step, 0);
			ctx.lineTo((i - min) * step, size);
			ctx.stroke();
			// Horizontal lines
			ctx.beginPath();
			ctx.moveTo(0, (max - i) * step);
			ctx.lineTo(size, (max - i) * step);
			ctx.stroke();
		}

		// Draw axes
		ctx.strokeStyle = '#333';
		// x-axis (y=0)
		ctx.beginPath();
		ctx.moveTo(0, (max - 0) * step);
		ctx.lineTo(size, (max - 0) * step);
		ctx.stroke();
		// y-axis (x=0)
		ctx.beginPath();
		ctx.moveTo((0 - min) * step, 0);
		ctx.lineTo((0 - min) * step, size);
		ctx.stroke();

		// Draw axis numbers
		ctx.fillStyle = '#333';
		ctx.font = '12px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		for (let i = min; i <= max; i++) {
			// x-axis numbers
			ctx.fillText(i, (i - min) * step, (max - 0) * step + 2);
			// y-axis numbers
			ctx.save();
			ctx.textAlign = 'right';
			ctx.textBaseline = 'middle';
			ctx.fillText(i, (0 - min) * step - 2, (max - i) * step);
			ctx.restore();
		}

		// Draw line
		ctx.strokeStyle = 'blue';
		ctx.beginPath();
		let started = false;
		if (questionIdx === 1) {
			// Question 2: y = mx + b
			for (let x = min; x <= max; x++) {
				let y = questions[1].line.m * x + questions[1].line.b;
				if (y >= min && y <= max) {
					let px = (x - min) * step;
					let py = (max - y) * step;
					if (!started) {
						ctx.moveTo(px, py);
						started = true;
					} else {
						ctx.lineTo(px, py);
					}
				}
			}
		} else if (questionIdx === 3) {
			// Question 4: y = 4 (horizontal line)
			let y = questions[3].line.b;
			let py = (max - y) * step;
			ctx.moveTo(0, py);
			ctx.lineTo(size, py);
		}
		ctx.stroke();
		// No red dot for the point
	}

	renderQuestion();

	prevBtn.onclick = function () {
		if (currentQuestion > 0) {
			saveAnswer();
			currentQuestion--;
			renderQuestion();
		}
	};
	nextBtn.onclick = function () {
		if (currentQuestion < questions.length - 1) {
			saveAnswer();
			currentQuestion++;
			renderQuestion();
		}
	};

	function saveAnswer() {
		if (currentQuestion === 0) {
			answers[0] = document.getElementById('slope').value.trim();
		} else if (currentQuestion === 1) {
			answers[1] = document.getElementById('point-on-line').value;
		} else if (currentQuestion === 2) {
			answers[2] = document.getElementById('eq-point-on-line').value;
		} else if (currentQuestion === 3) {
			answers[3] = document.getElementById('slope-type').value;
		}
	}

	quizForm.addEventListener('submit', function (e) {
		e.preventDefault();
		saveAnswer();
		// Show results screen
		let numCorrect = 0;
		let resultsHtml = '<h2>Quiz Results</h2><ol>';
		// Question 1
		let slopeInput = answers[0];
		let correctSlope = (11 - 3) / (5 - 2); // 8/3
		let correct1 = false;
		let userSlope = '';
		if (slopeInput) {
			if (slopeInput.includes('/')) {
				const parts = slopeInput.split('/');
				if (parts.length === 2) {
					const num = parseFloat(parts[0]);
					const denom = parseFloat(parts[1]);
					if (!isNaN(num) && !isNaN(denom) && Math.abs(num/denom - correctSlope) < 0.001) {
						correct1 = true;
					}
					userSlope = num/denom;
				}
			} else {
				const val = parseFloat(slopeInput);
				if (!isNaN(val) && Math.abs(val - correctSlope) < 0.001) {
					correct1 = true;
				}
				userSlope = val;
			}
		}
		if (correct1) numCorrect++;
		resultsHtml += `<li><strong>Question 1:</strong> Find the slope of the line passing through the points (2, 3) and (5, 11).<br>
		Your answer: <em>${slopeInput || '(no answer)'}</em> <br>
		${correct1 ? '<span style="color:green">Correct</span>' : '<span style="color:red">Incorrect</span>'}<br>
		Solution: Slope = (11 - 3) / (5 - 2) = 8 / 3 ≈ 2.67
		</li>`;
		// Question 2
		const [x2, y2] = questions[1].point;
		const { m, b } = questions[1].line;
		let onLine2 = Math.abs(y2 - (m * x2 + b)) < 0.001;
		let correct2 = (answers[1] === (onLine2 ? 'Yes' : 'No'));
		if (correct2) numCorrect++;
		resultsHtml += `<li><strong>Question 2:</strong> Is the point (4, 9) on the line y = 2x + 1?<br>
		Your answer: <em>${answers[1] || '(no answer)'}</em> <br>
		${correct2 ? '<span style="color:green">Correct</span>' : '<span style="color:red">Incorrect</span>'}<br>
		Solution: y = 2x + 1, for x = 4: y = 2*4 + 1 = 9. Point (4, 9) is on the line.
		</li>`;
		// Question 3
		const [x3, y3] = questions[2].point;
		const { a, b: b3, c } = questions[2].equation;
		let onLine3 = Math.abs(a * x3 + b3 * y3 - c) < 0.001;
		let correct3 = (answers[2] === (onLine3 ? 'Yes' : 'No'));
		if (correct3) numCorrect++;
		resultsHtml += `<li><strong>Question 3:</strong> Is the point (3, -2) on the line 2x - y = 8?<br>
		Your answer: <em>${answers[2] || '(no answer)'}</em> <br>
		${correct3 ? '<span style="color:green">Correct</span>' : '<span style="color:red">Incorrect</span>'}<br>
		Solution: 2x - y = 8, for (3, -2): 2*3 - (-2) = 6 + 2 = 8. Point (3, -2) is on the line.
		</li>`;
		// Question 4
		let correct4 = answers[3] === 'Zero';
		if (correct4) numCorrect++;
		resultsHtml += `<li><strong>Question 4:</strong> What is the slope of the line shown below?<br>
		Your answer: <em>${answers[3] || '(no answer)'}</em> <br>
		${correct4 ? '<span style="color:green">Correct</span>' : '<span style="color:red">Incorrect</span>'}<br>
		Solution: The slope is <strong>Zero</strong> (horizontal line).
		</li>`;
		resultsHtml += '</ol>';
		let percent = Math.round((numCorrect / 4) * 100);
		resultsHtml += `<h3>Score: ${numCorrect} / 4 (${percent}%)</h3>`;
		// Replace quiz with results
		document.getElementById('quiz-container').innerHTML = resultsHtml;
	});
});
