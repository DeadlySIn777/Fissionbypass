(1001)
(EXAMPLE PART - ALUMINUM POCKET)
(T1  D=6mm FLAT END MILL)
(Machine: Desktop CNC Router)
(Material: 6061 Aluminum)
(Optimized by FissionBypass Pro v2.0)
(Controller: GRBL)
(Material Profile: Aluminum)

G90 G94
G17
G21

(2D Pocket)
M5
M9
T1 M6
S10000 M3
G54

(Rapids restored to proper speed!)
G0 X0.000 Y0.000
G43 Z15.000 H1
G0 Z5.000

(Approach - FAST positioning)
G0 Z2.000
G1 Z-1.000 F500
G1 X10.000 F800
G1 Y10.000 F800
G1 X0.000 F800
G1 Y0.000 F800
G1 X20.000 F800
G1 Y20.000 F800
G1 X0.000 F800
G1 Y0.000 F800

(Retract - FAST)
G0 Z5.000
G0 X0.000 Y0.000

(Next operation approach - FAST)
G0 Z2.000
G1 Z-2.000 F500
G1 X15.000 F800
G1 Y15.000 F800
G1 X0.000 F800
G1 Y0.000 F800

(Final retract - FAST)
G0 Z15.000
G0 X0.000 Y0.000

M5
M9
M30
