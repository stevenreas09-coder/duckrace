"use client";

import { useRef, useEffect } from "react";

export default function DuckCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Paste ONLY the draw function here
  const drawDuck = (ctx: CanvasRenderingContext2D) => {
    // 👉 Put ALL your draw code here
    // (FROM: ctx.save(); var g = ctx.createLinearGradient... UNTIL the last ctx.restore())
    // Remove: "var SVGIcons = {}" and "Q.registerImage"
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,0)";
    ctx.miterLimit = 4;
    ctx.font = "15px ''";
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.font = "   15px ''";
    ctx.scale(0.7407407407407407, 0.7407407407407407);
    ctx.save();
    ctx.fillStyle = "#FFFDFD";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(108, 108.564);
    ctx.bezierCurveTo(107.684, 108.564, 107.257, 108.588, 106.788, 108.615);
    ctx.bezierCurveTo(104.509, 108.832, 105.007, 109.671, 104.335, 109.671);
    ctx.lineTo(101.055, 109.671);
    ctx.bezierCurveTo(99.898, 109.671, 99.898, 109.007, 98.7406, 109.671);
    ctx.bezierCurveTo(97.5832, 110.336, 96.6187, 109.007, 95.6541, 107.9);
    ctx.bezierCurveTo(94.6896, 106.792, 94.8825, 108.564, 93.7251, 108.564);
    ctx.bezierCurveTo(92.5677, 108.564, 91.7961, 107.014, 90.6386, 107.014);
    ctx.bezierCurveTo(89.4812, 107.014, 88.1309, 108.121, 86.3947, 107.457);
    ctx.bezierCurveTo(84.6586, 106.792, 84.4657, 107.9, 83.887, 107.9);
    ctx.lineTo(81.765, 107.9);
    ctx.bezierCurveTo(80.2352, 107.059, 78.0966, 107.471, 77.907, 108.564);
    ctx.bezierCurveTo(77.7563, 109.433, 76.2995, 108.121, 75.9779, 108.121);
    ctx.bezierCurveTo(75.4582, 106.788, 73.3664, 106.726, 71.927, 107.457);
    ctx.bezierCurveTo(70.8521, 108.002, 70.0622, 107.088, 69.805, 107.014);
    ctx.bezierCurveTo(68.848, 108.063, 65.6171, 108.976, 64.5966, 108.564);
    ctx.bezierCurveTo(63.8686, 108.27, 63.0534, 108.564, 60.9314, 109.671);
    ctx.bezierCurveTo(58.8095, 110.779, 57.845, 109.671, 56.1088, 109.671);
    ctx.bezierCurveTo(54.7199, 109.671, 54.6299, 110.114, 54.7585, 110.336);
    ctx.bezierCurveTo(54.5656, 110.557, 54.0255, 111, 53.4082, 111);
    ctx.lineTo(48.7785, 111);
    ctx.bezierCurveTo(46.2707, 111, 47.621, 110.336, 46.2707, 110.336);
    ctx.lineTo(44.5346, 110.336);
    ctx.lineTo(42.7984, 111);
    ctx.bezierCurveTo(42.2967, 110.387, 41.8263, 109.878, 41.324, 109.451);
    ctx.bezierCurveTo(38.5683, 108.592, 36.3782, 107.964, 34.6874, 107.587);
    ctx.bezierCurveTo(33.422, 107.802, 32.1218, 108.23, 30.0668, 108.986);
    ctx.bezierCurveTo(29.6748, 107.152, 30.9823, 106.763, 34.6874, 107.587);
    ctx.bezierCurveTo(35.1343, 107.512, 35.5769, 107.463, 36.0468, 107.436);
    ctx.bezierCurveTo(38.6402, 107.835, 40.0797, 108.393, 41.324, 109.451);
    ctx.bezierCurveTo(41.5543, 109.523, 41.7886, 109.596, 42.0268, 109.671);
    ctx.lineTo(43.57, 108.564);
    ctx.lineTo(46.2707, 108.564);
    ctx.lineTo(49.3572, 109.671);
    ctx.lineTo(52.0578, 108.564);
    ctx.lineTo(53.4082, 107.014);
    ctx.lineTo(56.1088, 107.014);
    ctx.lineTo(58.6166, 107.014);
    ctx.bezierCurveTo(59.5811, 107.014, 60.9314, 106.349, 61.5101, 106.349);
    ctx.lineTo(64.5966, 106.349);
    ctx.bezierCurveTo(65.1753, 106.349, 65.5899, 105.289, 66.5256, 105.021);
    ctx.bezierCurveTo(67.2973, 104.799, 68.1524, 106.475, 68.8405, 105.021);
    ctx.bezierCurveTo(68.8405, 105.021, 70.6409, 105.98, 70.9624, 105.685);
    ctx.bezierCurveTo(71.6508, 106.994, 72.1552, 106.465, 74.0489, 106.349);
    ctx.lineTo(76.5567, 106.349);
    ctx.lineTo(77.907, 105.685);
    ctx.bezierCurveTo(79.1211, 105.785, 79.6266, 105.96, 80.4147, 106.349);
    ctx.bezierCurveTo(82.0845, 107.27, 82.4824, 106.98, 83.1154, 106.349);
    ctx.bezierCurveTo(84.3803, 106.983, 84.8674, 106.79, 85.4302, 105.685);
    ctx.bezierCurveTo(85.8519, 105.594, 87.2268, 106.054, 87.7451, 106.349);
    ctx.bezierCurveTo(88.0906, 106.546, 88.5167, 105.685, 89.4812, 105.685);
    ctx.bezierCurveTo(90.2528, 105.685, 91.153, 107.014, 91.989, 107.014);
    ctx.lineTo(96.2328, 107.014);
    ctx.lineTo(98.7406, 108.564);
    ctx.bezierCurveTo(94.9514, 105.891, 97.908, 106.838, 103.563, 108.564);
    ctx.bezierCurveTo(104.226, 108.766, 105.635, 108.681, 106.788, 108.615);
    ctx.bezierCurveTo(107.126, 108.582, 107.526, 108.564, 108, 108.564);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.strokeStyle = "white";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(37.2042, 108.986);
    ctx.bezierCurveTo(35.5334, 107.445, 33.5996, 107.957, 30.0668, 108.986);
    ctx.moveTo(30.0668, 108.986);
    ctx.bezierCurveTo(29.481, 106.244, 32.6907, 106.733, 42.0268, 109.671);
    ctx.lineTo(43.57, 108.564);
    ctx.lineTo(46.2707, 108.564);
    ctx.lineTo(49.3572, 109.671);
    ctx.lineTo(52.0578, 108.564);
    ctx.lineTo(53.4082, 107.014);
    ctx.lineTo(56.1088, 107.014);
    ctx.bezierCurveTo(56.6232, 107.014, 57.845, 107.014, 58.6166, 107.014);
    ctx.bezierCurveTo(59.5811, 107.014, 60.9314, 106.349, 61.5101, 106.349);
    ctx.bezierCurveTo(62.0888, 106.349, 64.0179, 106.349, 64.5966, 106.349);
    ctx.bezierCurveTo(65.1753, 106.349, 65.5899, 105.289, 66.5256, 105.021);
    ctx.bezierCurveTo(67.2973, 104.799, 68.1524, 106.475, 68.8405, 105.021);
    ctx.bezierCurveTo(68.8405, 105.021, 70.6409, 105.98, 70.9624, 105.685);
    ctx.bezierCurveTo(71.6508, 106.994, 72.1552, 106.465, 74.0489, 106.349);
    ctx.lineTo(76.5567, 106.349);
    ctx.lineTo(77.907, 105.685);
    ctx.bezierCurveTo(79.1211, 105.785, 79.6266, 105.96, 80.4147, 106.349);
    ctx.bezierCurveTo(82.0845, 107.27, 82.4824, 106.98, 83.1154, 106.349);
    ctx.bezierCurveTo(84.3803, 106.983, 84.8674, 106.79, 85.4302, 105.685);
    ctx.bezierCurveTo(85.8519, 105.594, 87.2268, 106.054, 87.7451, 106.349);
    ctx.bezierCurveTo(88.0906, 106.546, 88.5167, 105.685, 89.4812, 105.685);
    ctx.bezierCurveTo(90.2528, 105.685, 91.153, 107.014, 91.989, 107.014);
    ctx.lineTo(96.2328, 107.014);
    ctx.lineTo(98.7406, 108.564);
    ctx.bezierCurveTo(94.9514, 105.891, 97.908, 106.838, 103.563, 108.564);
    ctx.bezierCurveTo(104.495, 108.848, 106.907, 108.564, 108, 108.564);
    ctx.bezierCurveTo(104.335, 108.564, 105.106, 109.671, 104.335, 109.671);
    ctx.bezierCurveTo(103.37, 109.671, 102.213, 109.671, 101.055, 109.671);
    ctx.bezierCurveTo(99.898, 109.671, 99.898, 109.007, 98.7406, 109.671);
    ctx.bezierCurveTo(97.5832, 110.336, 96.6187, 109.007, 95.6541, 107.9);
    ctx.bezierCurveTo(94.6896, 106.792, 94.8825, 108.564, 93.7251, 108.564);
    ctx.bezierCurveTo(92.5677, 108.564, 91.7961, 107.014, 90.6386, 107.014);
    ctx.bezierCurveTo(89.4812, 107.014, 88.1309, 108.121, 86.3947, 107.457);
    ctx.bezierCurveTo(84.6586, 106.792, 84.4657, 107.9, 83.887, 107.9);
    ctx.bezierCurveTo(83.424, 107.9, 82.2795, 107.9, 81.765, 107.9);
    ctx.bezierCurveTo(80.2352, 107.059, 78.0966, 107.471, 77.907, 108.564);
    ctx.bezierCurveTo(77.7563, 109.433, 76.2995, 108.121, 75.9779, 108.121);
    ctx.bezierCurveTo(75.4582, 106.788, 73.3664, 106.726, 71.927, 107.457);
    ctx.bezierCurveTo(70.8521, 108.002, 70.0622, 107.088, 69.805, 107.014);
    ctx.bezierCurveTo(68.848, 108.063, 65.6171, 108.976, 64.5966, 108.564);
    ctx.bezierCurveTo(63.8686, 108.27, 63.0534, 108.564, 60.9314, 109.671);
    ctx.bezierCurveTo(58.8095, 110.779, 57.845, 109.671, 56.1088, 109.671);
    ctx.bezierCurveTo(54.7199, 109.671, 54.6299, 110.114, 54.7585, 110.336);
    ctx.bezierCurveTo(54.5656, 110.557, 54.0255, 111, 53.4082, 111);
    ctx.bezierCurveTo(52.6365, 111, 51.2862, 111, 48.7785, 111);
    ctx.bezierCurveTo(46.2707, 111, 47.621, 110.336, 46.2707, 110.336);
    ctx.bezierCurveTo(45.1904, 110.336, 44.6632, 110.336, 44.5346, 110.336);
    ctx.lineTo(42.7984, 111);
    ctx.bezierCurveTo(41.0539, 108.869, 39.687, 107.997, 36.0468, 107.436);
    ctx.bezierCurveTo(34.2462, 107.54, 32.8475, 107.963, 30.0668, 108.986);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#FFFDFD";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(45.2378, 70.0656);
    ctx.lineTo(20.2832, 70.7738);
    ctx.bezierCurveTo(11.1554, 90.3961, 13.0123, 96.4447, 32.7602, 95.5616);
    ctx.bezierCurveTo(52.4119, 95.9831, 55.6149, 90.7326, 45.2378, 70.0656);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#FF8C00";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(20.9764, 109.017);
    ctx.bezierCurveTo(43.1814, 111.832, 57.3859, 111.484, 84.4026, 109.017);
    ctx.bezierCurveTo(96.0839, 92.693, 93.0674, 80.3342, 82.6697, 75.0225);
    ctx.bezierCurveTo(75.3516, 71.284, 73.8708, 68.0718, 76.7773, 65.1389);
    ctx.bezierCurveTo(71.5435, 60.9781, 69.865, 56.0116, 71.9781, 53.4216);
    ctx.bezierCurveTo(72.3218, 53.0002, 72.7659, 52.6418, 73.3114, 52.3599);
    ctx.bezierCurveTo(81.2349, 49.3356, 80.7582, 43.2769, 74.3515, 35.716);
    ctx.bezierCurveTo(53.9907, 17.9065, 26.0428, 45.4126, 46.2776, 67.5861);
    ctx.bezierCurveTo(47.7119, 69.2867, 46.9262, 69.6075, 45.2378, 70.0656);
    ctx.bezierCurveTo(55.6149, 90.7326, 52.4119, 95.9831, 32.7602, 95.5616);
    ctx.bezierCurveTo(13.0123, 96.4447, 11.1554, 90.3961, 20.2832, 70.7738);
    ctx.bezierCurveTo(17.9081, 69.1818, 16.9569, 68.0853, 15.7775, 65.8162);
    ctx.bezierCurveTo(12.329, 61.1852, 6.97695, 61.5942, 4.68655, 67.5868);
    ctx.bezierCurveTo(1.97858, 83.92, 7.25561, 98.057, 20.9764, 109.017);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#FF691E";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(89.2549, 53.4216);
    ctx.bezierCurveTo(88.6638, 52.6781, 91.4389, 49.912, 91.3345, 47.7558);
    ctx.bezierCurveTo(91.2301, 45.5996, 88.9063, 45.6325, 85.9669, 46.8278);
    ctx.bezierCurveTo(82.2061, 47.992, 80.4292, 47.2205, 79.2035, 43.153);
    ctx.bezierCurveTo(78.1552, 40.993, 76.8472, 38.2193, 74.3515, 35.716);
    ctx.bezierCurveTo(80.7582, 43.2769, 81.2349, 49.3356, 73.3114, 52.3599);
    ctx.bezierCurveTo(72.7659, 52.6418, 72.3218, 53.0002, 71.9781, 53.4216);
    ctx.bezierCurveTo(76.4247, 60.4463, 80.4595, 59.6829, 89.2549, 53.4216);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#FF691E";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(82.6697, 61.5662);
    ctx.bezierCurveTo(93.2508, 57.7752, 93.894, 56.0555, 89.2549, 53.4216);
    ctx.bezierCurveTo(80.4595, 59.6829, 76.4247, 60.4463, 71.9781, 53.4216);
    ctx.bezierCurveTo(69.865, 56.0116, 71.5435, 60.9781, 76.7773, 65.1389);
    ctx.bezierCurveTo(78.0005, 63.9047, 80.0006, 62.7199, 82.6697, 61.5662);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(89.2549, 53.4216);
    ctx.bezierCurveTo(93.894, 56.0555, 93.2508, 57.7752, 82.6697, 61.5662);
    ctx.bezierCurveTo(80.0006, 62.7199, 78.0005, 63.9047, 76.7773, 65.1389);
    ctx.moveTo(89.2549, 53.4216);
    ctx.bezierCurveTo(88.6638, 52.6781, 91.4389, 49.912, 91.3345, 47.7558);
    ctx.bezierCurveTo(91.2301, 45.5996, 88.9063, 45.6325, 85.9669, 46.8278);
    ctx.bezierCurveTo(82.2061, 47.992, 80.4292, 47.2205, 79.2035, 43.153);
    ctx.bezierCurveTo(78.1552, 40.993, 76.8472, 38.2193, 74.3515, 35.716);
    ctx.moveTo(89.2549, 53.4216);
    ctx.bezierCurveTo(80.4595, 59.6829, 76.4247, 60.4463, 71.9781, 53.4216);
    ctx.moveTo(74.3515, 35.716);
    ctx.bezierCurveTo(53.9907, 17.9065, 26.0428, 45.4126, 46.2776, 67.5861);
    ctx.bezierCurveTo(47.7119, 69.2867, 46.9262, 69.6075, 45.2378, 70.0656);
    ctx.moveTo(74.3515, 35.716);
    ctx.bezierCurveTo(80.7582, 43.2769, 81.2349, 49.3356, 73.3114, 52.3599);
    ctx.bezierCurveTo(72.7659, 52.6418, 72.3218, 53.0002, 71.9781, 53.4216);
    ctx.moveTo(45.2378, 70.0656);
    ctx.lineTo(20.2832, 70.7738);
    ctx.moveTo(45.2378, 70.0656);
    ctx.bezierCurveTo(55.6149, 90.7326, 52.4119, 95.9831, 32.7602, 95.5616);
    ctx.bezierCurveTo(13.0123, 96.4447, 11.1554, 90.3961, 20.2832, 70.7738);
    ctx.moveTo(20.2832, 70.7738);
    ctx.bezierCurveTo(17.9081, 69.1818, 16.9569, 68.0853, 15.7775, 65.8162);
    ctx.bezierCurveTo(12.329, 61.1852, 6.97695, 61.5942, 4.68655, 67.5868);
    ctx.bezierCurveTo(1.97858, 83.92, 7.25561, 98.057, 20.9764, 109.017);
    ctx.bezierCurveTo(43.1814, 111.832, 57.3859, 111.484, 84.4026, 109.017);
    ctx.bezierCurveTo(96.0839, 92.693, 93.0674, 80.3342, 82.6697, 75.0225);
    ctx.bezierCurveTo(75.3516, 71.284, 73.8708, 68.0718, 76.7773, 65.1389);
    ctx.moveTo(76.7773, 65.1389);
    ctx.bezierCurveTo(71.5435, 60.9781, 69.865, 56.0116, 71.9781, 53.4216);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#D9D9D9";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1.5;
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(70.1993, 37.124);
    ctx.bezierCurveTo(72.5206, 37.1243, 74.6476, 39.492, 74.6476, 42.748);
    ctx.bezierCurveTo(74.6476, 46.0041, 72.5206, 48.3718, 70.1993, 48.3721);
    ctx.bezierCurveTo(67.8779, 48.3721, 65.7501, 46.0042, 65.7501, 42.748);
    ctx.bezierCurveTo(65.7501, 39.4919, 67.8779, 37.124, 70.1993, 37.124);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(73.3183, 42.7482);
    ctx.bezierCurveTo(73.3183, 44.7039, 72.2321, 46.2893, 70.8922, 46.2893);
    ctx.bezierCurveTo(69.5523, 46.2893, 68.4661, 44.7039, 68.4661, 42.7482);
    ctx.bezierCurveTo(68.4661, 40.7924, 69.5523, 39.207, 70.8922, 39.207);
    ctx.bezierCurveTo(72.2321, 39.207, 73.3183, 40.7924, 73.3183, 42.7482);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#D9D9D9";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(71.931983, 42.0398);
    ctx.bezierCurveTo(
      71.931983,
      42.43094186694891,
      71.62163439974195,
      42.748025,
      71.2388,
      42.748025
    );
    ctx.bezierCurveTo(
      70.85596560025805,
      42.748025,
      70.545617,
      42.43094186694891,
      70.545617,
      42.0398
    );
    ctx.bezierCurveTo(
      70.545617,
      41.648658133051086,
      70.85596560025805,
      41.331575,
      71.2388,
      41.331575
    );
    ctx.bezierCurveTo(
      71.62163439974195,
      41.331575,
      71.931983,
      41.648658133051086,
      71.931983,
      42.0398
    );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#479FBB";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(29.5974, 108.5);
    ctx.bezierCurveTo(37.8939, 104.627, 41.8096, 105.706, 48.5974, 108.5);
    ctx.bezierCurveTo(58.9849, 104.069, 64.0993, 104.204, 72.0974, 108.5);
    ctx.bezierCurveTo(77.075, 105.692, 80.1187, 104.677, 88.0974, 108.5);
    ctx.bezierCurveTo(86.6827, 104.253, 87.589, 102.891, 90.0974, 101);
    ctx.bezierCurveTo(98.5704, 101.883, 100.545, 104.371, 99.5974, 112);
    ctx.bezierCurveTo(95.9674, 111.833, 86.0854, 112.666, 85.5974, 116);
    ctx.bezierCurveTo(84.9921, 120.135, 64.7685, 122.138, 65.0974, 117.5);
    ctx.bezierCurveTo(65.2926, 114.747, 35.6491, 116.155, 34.5974, 118.5);
    ctx.bezierCurveTo(33.619, 120.682, 20.1324, 120.227, 14.0974, 118.5);
    ctx.bezierCurveTo(10.197, 116.244, 7.25204, 115.476, 1.09744, 114.5);
    ctx.bezierCurveTo(-0.970966, 112.375, -0.103427, 111.038, 3.59744, 108.5);
    ctx.bezierCurveTo(8.93434, 107.664, 10.2535, 105.908, 11.5974, 102);
    ctx.bezierCurveTo(15.091, 104.537, 15.5148, 105.963, 11.5974, 108.5);
    ctx.bezierCurveTo(18.627, 105.318, 22.568, 105.761, 29.5974, 108.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#FF0000";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(41.6385, 37.0156);
    ctx.bezierCurveTo(43.4133, 37.1458, 47.4571, 37.0333, 54.1864, 34.7162);
    ctx.bezierCurveTo(60.9225, 32.3967, 64.1716, 29.9982, 65.4951, 28.7954);
    ctx.lineTo(45.8972, 10.0621);
    ctx.lineTo(41.6385, 37.0156);
    ctx.closePath();
    ctx.moveTo(50.1449, 28.695);
    ctx.bezierCurveTo(50.9007, 30.8902, 53.8785, 31.8571, 56.7929, 30.8536);
    ctx.bezierCurveTo(57.2535, 30.695, 57.6669, 30.4889, 58.0645, 30.2594);
    ctx.bezierCurveTo(57.11, 31.5957, 55.6065, 32.7447, 53.73, 33.3908);
    ctx.bezierCurveTo(49.8396, 34.7304, 45.875, 33.4431, 44.8659, 30.5127);
    ctx.bezierCurveTo(43.8569, 27.5823, 46.1886, 24.1271, 50.079, 22.7875);
    ctx.bezierCurveTo(51.9555, 22.1414, 53.8476, 22.1211, 55.4226, 22.5865);
    ctx.bezierCurveTo(54.9679, 22.6504, 54.5152, 22.7425, 54.0547, 22.9011);
    ctx.bezierCurveTo(51.1403, 23.9046, 49.389, 26.4998, 50.1449, 28.695);
    ctx.closePath();
    ctx.moveTo(50.4695, 18.2054);
    ctx.bezierCurveTo(50.2182, 17.4753, 49.2227, 17.1521, 48.2535, 17.4858);
    ctx.bezierCurveTo(47.2843, 17.8196, 46.6989, 18.6871, 46.9502, 19.4171);
    ctx.bezierCurveTo(47.2016, 20.1472, 48.1971, 20.4704, 49.1663, 20.1367);
    ctx.bezierCurveTo(50.1354, 19.8029, 50.7209, 18.9354, 50.4695, 18.2054);
    ctx.closePath();
    ctx.moveTo(58.9431, 25.6656);
    ctx.bezierCurveTo(58.6917, 24.9355, 57.6963, 24.6123, 56.7271, 24.946);
    ctx.bezierCurveTo(55.7579, 25.2798, 55.1725, 26.1473, 55.4238, 26.8773);
    ctx.bezierCurveTo(55.6752, 27.6074, 56.6707, 27.9306, 57.6398, 27.5969);
    ctx.bezierCurveTo(58.609, 27.2631, 59.1945, 26.3956, 58.9431, 25.6656);
    ctx.closePath();
    ctx.fill("evenodd");
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#7A6060";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(50.1449, 28.695);
    ctx.bezierCurveTo(50.9007, 30.8902, 53.8785, 31.8571, 56.7929, 30.8536);
    ctx.bezierCurveTo(57.2535, 30.695, 57.6669, 30.4889, 58.0645, 30.2594);
    ctx.bezierCurveTo(57.11, 31.5957, 55.6065, 32.7447, 53.73, 33.3908);
    ctx.bezierCurveTo(49.8396, 34.7304, 45.875, 33.4431, 44.8659, 30.5127);
    ctx.bezierCurveTo(43.8569, 27.5823, 46.1886, 24.1271, 50.079, 22.7875);
    ctx.bezierCurveTo(51.9555, 22.1414, 53.8476, 22.1211, 55.4226, 22.5865);
    ctx.bezierCurveTo(54.9679, 22.6504, 54.5152, 22.7425, 54.0547, 22.9011);
    ctx.bezierCurveTo(51.1403, 23.9046, 49.389, 26.4998, 50.1449, 28.695);
    ctx.closePath();
    ctx.moveTo(50.4695, 18.2054);
    ctx.bezierCurveTo(50.2182, 17.4753, 49.2227, 17.1521, 48.2535, 17.4858);
    ctx.bezierCurveTo(47.2843, 17.8196, 46.6989, 18.6871, 46.9502, 19.4171);
    ctx.bezierCurveTo(47.2016, 20.1472, 48.1971, 20.4704, 49.1663, 20.1367);
    ctx.bezierCurveTo(50.1354, 19.8029, 50.7209, 18.9354, 50.4695, 18.2054);
    ctx.closePath();
    ctx.moveTo(58.9431, 25.6656);
    ctx.bezierCurveTo(58.6917, 24.9355, 57.6963, 24.6123, 56.7271, 24.946);
    ctx.bezierCurveTo(55.7579, 25.2798, 55.1725, 26.1473, 55.4238, 26.8773);
    ctx.bezierCurveTo(55.6752, 27.6074, 56.6707, 27.9306, 57.6398, 27.5969);
    ctx.bezierCurveTo(58.609, 27.2631, 59.1945, 26.3956, 58.9431, 25.6656);
    ctx.closePath();
    ctx.fill("evenodd");
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#24E844";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(55.0992, 37.367);
    ctx.bezierCurveTo(44.1838, 41.1255, 39.2663, 39.7725, 38.7401, 39.6062);
    ctx.lineTo(37.6962, 39.2765);
    ctx.lineTo(42.957, 5.96659);
    ctx.lineTo(56.3606, 1.35138);
    ctx.lineTo(49.5784, 8.67291);
    ctx.lineTo(69.9834, 28.1649);
    ctx.lineTo(69.3689, 29.0599);
    ctx.bezierCurveTo(69.0566, 29.5149, 66.0145, 33.6086, 55.0992, 37.367);
    ctx.closePath();
    ctx.moveTo(54.1864, 34.7162);
    ctx.bezierCurveTo(47.4571, 37.0333, 43.4133, 37.1458, 41.6385, 37.0156);
    ctx.lineTo(45.8972, 10.0621);
    ctx.lineTo(65.4951, 28.7954);
    ctx.bezierCurveTo(64.1716, 29.9982, 60.9225, 32.3967, 54.1864, 34.7162);
    ctx.closePath();
    ctx.fill("evenodd");
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.strokeStyle = "black";
    ctx.font = "   15px ''";
    ctx.beginPath();
    ctx.moveTo(54.641, 2.47228);
    ctx.lineTo(49.2112, 8.33278);
    ctx.lineTo(48.8772, 8.69463);
    ctx.lineTo(49.2329, 9.03485);
    ctx.lineTo(69.3289, 28.2325);
    ctx.lineTo(68.9566, 28.7769);
    ctx.bezierCurveTo(68.7156, 29.128, 65.7694, 33.1639, 54.936, 36.8942);
    ctx.bezierCurveTo(44.1052, 40.6235, 39.2989, 39.2581, 38.8911, 39.1293);
    ctx.lineTo(38.256, 38.9286);
    ctx.lineTo(43.4047, 6.34126);
    ctx.lineTo(54.641, 2.47228);
    ctx.closePath();
    ctx.moveTo(45.4035, 9.98367);
    ctx.lineTo(41.145, 36.9372);
    ctx.lineTo(41.0595, 37.4748);
    ctx.lineTo(41.6018, 37.5142);
    ctx.bezierCurveTo(43.454, 37.6501, 47.5658, 37.5243, 54.3488, 35.1887);
    ctx.bezierCurveTo(60.7148, 32.9967, 64.0231, 30.7238, 65.5496, 29.414);
    ctx.lineTo(65.8316, 29.1651);
    ctx.lineTo(66.228, 28.8045);
    ctx.lineTo(65.8402, 28.434);
    ctx.lineTo(46.2429, 9.70084);
    ctx.lineTo(45.552, 9.0412);
    ctx.lineTo(45.4035, 9.98367);
    ctx.closePath();
    ctx.moveTo(64.7509, 28.777);
    ctx.bezierCurveTo(63.2654, 30.0158, 60.081, 32.1573, 54.0232, 34.2432);
    ctx.bezierCurveTo(47.9807, 36.3238, 44.1503, 36.6006, 42.2195, 36.5424);
    ctx.lineTo(46.2417, 11.0832);
    ctx.lineTo(64.7509, 28.777);
    ctx.closePath();
    ctx.moveTo(49.6724, 28.8575);
    ctx.bezierCurveTo(50.1128, 30.1365, 51.1895, 31.0221, 52.5055, 31.4494);
    ctx.bezierCurveTo(53.577, 31.7971, 54.8265, 31.8503, 56.0907, 31.57);
    ctx.bezierCurveTo(55.3706, 32.1223, 54.5222, 32.5893, 53.567, 32.9182);
    ctx.bezierCurveTo(51.7145, 33.556, 49.8626, 33.5612, 48.3718, 33.0772);
    ctx.bezierCurveTo(46.9747, 32.6235, 45.9198, 31.7523, 45.4291, 30.5871);
    ctx.lineTo(45.3391, 30.3496);
    ctx.bezierCurveTo(44.897, 29.0655, 45.1731, 27.6318, 46.0496, 26.333);
    ctx.bezierCurveTo(46.9263, 25.0339, 48.3893, 23.8987, 50.2417, 23.2608);
    ctx.bezierCurveTo(51.1972, 22.9318, 52.1534, 22.7762, 53.0611, 22.7682);
    ctx.bezierCurveTo(51.8918, 23.3257, 50.9399, 24.1377, 50.3095, 25.0717);
    ctx.bezierCurveTo(49.5356, 26.2186, 49.2321, 27.5785, 49.6724, 28.8575);
    ctx.closePath();
    ctx.moveTo(58.4701, 25.8282);
    ctx.bezierCurveTo(58.5331, 26.011, 58.5048, 26.2475, 58.3347, 26.4997);
    ctx.bezierCurveTo(58.1645, 26.7518, 57.8679, 26.9899, 57.4768, 27.1246);
    ctx.bezierCurveTo(57.0858, 27.2591, 56.7061, 27.2539, 56.4169, 27.16);
    ctx.bezierCurveTo(56.1635, 27.0777, 56.0034, 26.9382, 55.9252, 26.7819);
    ctx.lineTo(55.8968, 26.7143);
    ctx.bezierCurveTo(55.8339, 26.5314, 55.862, 26.295, 56.0322, 26.0428);
    ctx.bezierCurveTo(56.2023, 25.7907, 56.4986, 25.5538, 56.8895, 25.4191);
    ctx.bezierCurveTo(57.2807, 25.2844, 57.6607, 25.2885, 57.95, 25.3824);
    ctx.bezierCurveTo(58.2393, 25.4764, 58.4071, 25.6453, 58.4701, 25.8282);
    ctx.closePath();
    ctx.moveTo(49.9967, 18.3679);
    ctx.bezierCurveTo(50.0596, 18.5507, 50.0313, 18.7873, 49.8612, 19.0394);
    ctx.bezierCurveTo(49.6911, 19.2916, 49.3944, 19.5296, 49.0033, 19.6643);
    ctx.bezierCurveTo(48.6123, 19.7989, 48.2327, 19.7937, 47.9434, 19.6998);
    ctx.bezierCurveTo(47.69, 19.6175, 47.53, 19.4779, 47.4517, 19.3217);
    ctx.lineTo(47.4233, 19.254);
    ctx.bezierCurveTo(47.3604, 19.0711, 47.3885, 18.8347, 47.5587, 18.5825);
    ctx.bezierCurveTo(47.7289, 18.3304, 48.0251, 18.0935, 48.4161, 17.9589);
    ctx.bezierCurveTo(48.8072, 17.8242, 49.1872, 17.8282, 49.4765, 17.9222);
    ctx.bezierCurveTo(49.7658, 18.0161, 49.9336, 18.1851, 49.9967, 18.3679);
    ctx.closePath();
    ctx.moveTo(50.6179, 28.5319);
    ctx.bezierCurveTo(50.3025, 27.6158, 50.4971, 26.5815, 51.1384, 25.6312);
    ctx.bezierCurveTo(51.7799, 24.6806, 52.8535, 23.8436, 54.2177, 23.3738);
    ctx.bezierCurveTo(54.6386, 23.2289, 55.0578, 23.1428, 55.4919, 23.0818);
    ctx.lineTo(55.5641, 22.1067);
    ctx.bezierCurveTo(53.8839, 21.6103, 51.8852, 21.6373, 49.9161, 22.3153);
    ctx.bezierCurveTo(47.8784, 23.017, 46.2301, 24.2779, 45.2208, 25.7735);
    ctx.bezierCurveTo(44.2111, 27.2697, 43.8268, 29.0289, 44.3936, 30.6751);
    ctx.bezierCurveTo(44.9604, 32.3214, 46.3463, 33.4709, 48.0631, 34.0284);
    ctx.bezierCurveTo(49.7794, 34.5856, 51.8547, 34.5653, 53.8925, 33.8637);
    ctx.bezierCurveTo(55.8617, 33.1857, 57.4529, 31.9756, 58.4713, 30.5499);
    ctx.lineTo(57.8144, 29.8269);
    ctx.bezierCurveTo(57.4348, 30.0461, 57.0514, 30.2363, 56.6306, 30.3812);
    ctx.bezierCurveTo(55.2665, 30.8509, 53.9049, 30.8522, 52.8143, 30.4982);
    ctx.bezierCurveTo(51.7921, 30.1663, 51.0334, 29.5342, 50.6826, 28.7017);
    ctx.lineTo(50.6179, 28.5319);
    ctx.closePath();
    ctx.moveTo(59.4157, 25.5026);
    ctx.bezierCurveTo(59.2272, 24.9556, 58.772, 24.5979, 58.2587, 24.4312);
    ctx.bezierCurveTo(57.7452, 24.2645, 57.142, 24.2746, 56.564, 24.4736);
    ctx.bezierCurveTo(55.9861, 24.6727, 55.5053, 25.0359, 55.2033, 25.4833);
    ctx.bezierCurveTo(54.9014, 25.9307, 54.763, 26.4928, 54.9512, 27.0398);
    ctx.bezierCurveTo(55.1396, 27.5869, 55.5949, 27.9445, 56.1082, 28.1112);
    ctx.bezierCurveTo(56.6216, 28.2779, 57.2244, 28.269, 57.8023, 28.0701);
    ctx.bezierCurveTo(58.3804, 27.871, 58.8616, 27.5067, 59.1636, 27.0591);
    ctx.bezierCurveTo(59.4654, 26.6118, 59.604, 26.0496, 59.4157, 25.5026);
    ctx.closePath();
    ctx.moveTo(50.9422, 18.0423);
    ctx.bezierCurveTo(50.7538, 17.4954, 50.2985, 17.1377, 49.7852, 16.971);
    ctx.bezierCurveTo(49.2717, 16.8043, 48.6685, 16.8143, 48.0905, 17.0133);
    ctx.bezierCurveTo(47.5126, 17.2124, 47.0318, 17.5757, 46.7299, 18.0231);
    ctx.bezierCurveTo(46.428, 18.4704, 46.2895, 19.0326, 46.4778, 19.5796);
    ctx.bezierCurveTo(46.6661, 20.1266, 47.1214, 20.4842, 47.6347, 20.6509);
    ctx.bezierCurveTo(48.1481, 20.8176, 48.7509, 20.8088, 49.3289, 20.6098);
    ctx.bezierCurveTo(49.9069, 20.4108, 50.3881, 20.0464, 50.6901, 19.5989);
    ctx.bezierCurveTo(50.9919, 19.1515, 51.1305, 18.5893, 50.9422, 18.0423);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    // dynamic text
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset any scale/translate
    ctx.fillStyle = "black";
    ctx.font = "italic bold 13px Arial";
    ctx.fillText("1", 22, 66); // add dx/dy manually
    ctx.restore();
  };

  /* -------------------------
       PASTE YOUR FULL DUCK PATH
       ------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawDuck(ctx);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={200}
      className="border bg-white border-gray-400 rounded"
    />
  );
}
