(1001)
(EXAMPLE PART - ALUMINUM POCKET)
(T1  D=6mm FLAT END MILL)
(Machine: Desktop CNC Router)
(Material: 6061 Aluminum)
(***THIS FILE DOES NOT CONTAIN FULL NC CODE***)
(When using Fusion for Personal Use, the feedrate of rapid)
(moves is reduced to match the feedrate of cutting moves,)
(which can increase machining time. Unrestricted rapid moves)
(are available with a Fusion Subscription.)

G90 G94
G17
G21

(2D Pocket)
M5
M9
T1 M6
S10000 M3
G54

(NOTICE: All rapids limited to cutting feedrate!)
G0 X0.000 Y0.000
G43 Z15.000 H1
G0 Z5.000

(Approach - SLOW due to hobby restriction)
G1 Z2.000 F2
G1 Z-1.000 F2
G1 X10.000 F5
G1 Y10.000 F5
G1 X0.000 F5
G1 Y0.000 F5
G1 X20.000 F5
G1 Y20.000 F5
G1 X0.000 F5
G1 Y0.000 F5

(Retract - SLOW)
G1 Z5.000 F2
G0 X0.000 Y0.000 F2

(Next operation approach - SLOW)
G1 Z2.000 F2
G1 Z-2.000 F5
G1 X15.000 F5
G1 Y15.000 F5
G1 X0.000 F5
G1 Y0.000 F5

(Final retract - SLOW)
G1 Z15.000 F2
G0 X0.000 Y0.000 F2

M5
M9
M30
