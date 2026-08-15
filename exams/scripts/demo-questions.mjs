// Demo question bank for walkthroughs and testing.
//
// These questions exercise the platform. They are NOT vetted DGCA material and
// must be replaced by the real bank before any student sits a graded paper.
// Every row is written with source = 'demo-seed', so the whole set lifts out in
// one statement:
//
//   delete from questions where source = 'demo-seed';
//
// Authoring format per row, correct answer first so it is easy to write:
//   [stem, difficulty, correctOption, wrongA, wrongB, wrongC, explanation]
// The seed script shuffles the four options per question and records whichever
// letter the correct one landed on, so answers spread across A to D instead of
// every key being A.

/** @type {Record<string, Record<string, Array<[string, string, string, string, string, string, string]>>>} */
export const BANK = {
  NAV: {
    "Magnetism and compass": [
      ["Convert a magnetic heading of 145 degrees to true, given 2 degrees West variation.", "medium", "143 degrees", "147 degrees", "145 degrees", "137 degrees", "Variation west, magnetic best. True is less than magnetic, so 145 minus 2 gives 143."],
      ["What is the primary cause of compass deviation in an aircraft?", "easy", "Magnetic fields within the aircraft", "The earth magnetic field", "Change of latitude", "Change of airspeed", "Deviation comes from the aircraft itself, mainly wiring and ferrous components near the compass."],
      ["Northerly turning error is greatest at which latitude?", "medium", "High latitude", "The magnetic equator", "45 degrees south only", "It does not vary with latitude", "Dip angle grows toward the poles, so turning error grows with latitude and is nil at the magnetic equator."],
      ["An isogonal line joins points of equal:", "easy", "Magnetic variation", "Magnetic deviation", "Atmospheric pressure", "Terrain elevation", "Isogonals connect places of equal variation. The line of zero variation is the agonic line."],
      ["Compass dip is defined as the angle between:", "medium", "The magnetic field and the horizontal", "True and magnetic north", "Magnetic and compass north", "Heading and track", "Dip is the vertical angle the earth field makes with the horizontal, near zero at the equator."]
    ],
    "Charts and projections": [
      ["On a Lambert conformal conic chart, a straight line most closely represents a:", "medium", "Great circle", "Rhumb line", "Parallel of latitude", "Line of equal variation", "On Lambert charts a straight line approximates a great circle, which suits long range navigation."],
      ["On a Mercator projection, a rhumb line appears as a:", "easy", "Straight line", "Curve concave to the pole", "Circle", "Spiral toward the pole", "Mercator is the projection on which rhumb lines plot straight, which is why it suited marine navigation."],
      ["On a chart of scale 1:500,000, one centimetre represents:", "easy", "5 kilometres", "50 kilometres", "500 metres", "0.5 kilometres", "500,000 cm equals 5,000 m, which is 5 km."],
      ["Convergency between two meridians is greatest at:", "hard", "The poles", "The equator", "45 degrees north", "It is constant everywhere", "Convergency equals change of longitude times sine of latitude, so it peaks at the poles and is zero at the equator."],
      ["A conformal chart is one on which:", "medium", "Angles are correctly represented", "Areas are correctly represented", "All distances are constant", "Scale never changes", "Conformality preserves shape and bearing locally, which is what navigation charts need."]
    ],
    "Flight planning": [
      ["An aircraft holds a TAS of 180 kt on heading 090 with wind 240/30. The track is approximately:", "medium", "098 degrees", "083 degrees", "104 degrees", "112 degrees", "The south westerly wind pushes the aircraft north of heading, giving roughly 8 degrees of drift to the right."],
      ["Given a TAS of 200 kt and a headwind component of 25 kt, groundspeed is:", "easy", "175 kt", "225 kt", "200 kt", "165 kt", "Headwind is subtracted from true airspeed to give groundspeed."],
      ["The point of no return is determined primarily by:", "medium", "Usable fuel and groundspeeds", "Runway length", "Aircraft empty mass", "Cabin altitude", "PNR depends on endurance on usable fuel together with the groundspeeds out and back."],
      ["The equitime point moves toward which end of the route in a headwind outbound?", "hard", "The departure end", "The destination end", "It stays at midpoint", "It moves off track", "With a faster return leg the critical point shifts back toward departure."],
      ["One nautical mile corresponds to one minute of:", "easy", "Latitude", "Longitude at any latitude", "Arc on any great circle only at the equator", "Time", "A nautical mile is one minute of arc of latitude, which is why latitude scales measure distance."]
    ]
  },
  MET: {
    "Atmosphere and altimetry": [
      ["The tropopause over the equator lies at approximately:", "easy", "16 kilometres", "8 kilometres", "11 kilometres", "20 kilometres", "The tropopause is highest over the equator at roughly 16 km and lowest over the poles at around 8 km."],
      ["Standard sea level conditions in the ISA are:", "easy", "1013.25 hPa and 15 degrees C", "1000 hPa and 20 degrees C", "1013.25 hPa and 0 degrees C", "1025 hPa and 15 degrees C", "The International Standard Atmosphere defines 1013.25 hPa and 15 degrees C at mean sea level."],
      ["Flying from high pressure to low pressure at a constant indicated altitude means true altitude:", "medium", "Decreases", "Increases", "Stays the same", "Becomes undefined", "High to low, look out below. The altimeter over-reads so the aircraft is lower than indicated."],
      ["The ISA temperature lapse rate in the troposphere is approximately:", "easy", "2 degrees C per 1000 feet", "3 degrees C per 1000 feet", "1 degree C per 1000 feet", "5 degrees C per 1000 feet", "Roughly 1.98 degrees C per 1000 ft, equivalent to 6.5 degrees C per kilometre."],
      ["QNH set on the subscale causes the altimeter to read:", "medium", "Elevation above mean sea level", "Height above the airfield", "Pressure altitude", "Density altitude", "QNH references mean sea level, so on the ground the altimeter shows airfield elevation."]
    ],
    "Icing and airframe": [
      ["Clear ice is most likely to form from:", "medium", "Large supercooled droplets", "Very small droplets", "Dry snow", "Ice crystals", "Large supercooled droplets freeze slowly on impact and spread back, forming dense clear ice."],
      ["The greatest risk of airframe icing in cumuliform cloud generally lies between:", "medium", "0 and minus 20 degrees C", "Minus 40 and minus 60 degrees C", "Plus 5 and plus 15 degrees C", "Below minus 60 degrees C", "Supercooled water is most abundant just below freezing and becomes rare below about minus 20 degrees C."],
      ["Carburettor icing can occur at ambient temperatures:", "medium", "Well above freezing", "Only below freezing", "Only inside cloud", "Only at night", "Fuel vaporisation and the venturi pressure drop cool the air, so icing occurs up to around plus 25 degrees C in humid conditions."],
      ["Freezing rain at the surface indicates:", "hard", "A warmer layer aloft", "Uniformly cold air throughout", "Very dry air aloft", "Strong subsidence", "Rain falls from a warm layer above and supercools while descending through colder air beneath."],
      ["Hoar frost forms by:", "medium", "Water vapour subliming directly onto a cold surface", "Rain freezing on impact", "Cloud droplets coalescing", "Snow compacting", "Vapour changes straight to ice on a surface already below freezing, and it must be removed before flight."]
    ],
    "Winds and pressure systems": [
      ["In the northern hemisphere, air circulates around a low pressure system:", "easy", "Anticlockwise", "Clockwise", "Directly outward", "Directly inward with no deflection", "Coriolis deflection to the right produces anticlockwise circulation around a northern hemisphere low."],
      ["Jet streams are generally strongest in:", "medium", "Winter", "Summer", "Spring", "Autumn", "The stronger winter temperature gradient produces a stronger thermal wind component and faster jets."],
      ["A katabatic wind is caused by:", "medium", "Cold dense air draining downslope", "Daytime sea breeze circulation", "Convective overturning", "Frontal lifting", "Radiative cooling makes air over high ground dense, and it then flows downhill under gravity."],
      ["Veering wind in the northern hemisphere means the wind direction changes:", "medium", "Clockwise", "Anticlockwise", "By exactly 180 degrees", "Only in speed", "Veering is a clockwise change of direction, backing is anticlockwise."]
    ]
  },
  REG: {
    "Rules of the air": [
      ["Under which condition may a pilot deviate from an ATC clearance?", "medium", "An emergency requiring immediate action", "A passenger request", "To save fuel", "To avoid a longer routing", "Deviation is permitted in an emergency, and ATC must be advised as soon as practicable."],
      ["Two aircraft approaching head on shall each:", "easy", "Alter heading to the right", "Alter heading to the left", "Climb immediately", "Descend immediately", "Both alter course to the right so they pass left side to left side."],
      ["When one aircraft is overtaking another, the aircraft being overtaken:", "easy", "Has right of way", "Must descend", "Must turn left", "Must accelerate", "The overtaking aircraft keeps clear by altering course to the right."],
      ["The semicircular rule for cruising levels is based on:", "medium", "Magnetic track", "True heading", "Magnetic heading", "Groundspeed", "Levels are allocated by magnetic track, with odd levels typically for tracks 000 to 179 degrees."],
      ["An aircraft in distress has right of way over:", "easy", "All other traffic", "Only lighter aircraft", "Only VFR traffic", "Nothing, it must give way", "An aircraft in distress has priority over all other traffic."]
    ],
    "Licensing and documents": [
      ["A Class 1 medical certificate for commercial privileges is normally valid for:", "medium", "12 months", "24 months", "6 months", "36 months", "Twelve months is the standard validity, reducing with age under most authorities."],
      ["Which document must be carried on board for an international flight?", "easy", "Certificate of Registration", "The purchase invoice", "The full maintenance manual", "A blank load sheet", "Registration, airworthiness, radio licence, insurance and the journey log are required."],
      ["Passenger carrying recency normally requires how many takeoffs and landings in the preceding 90 days?", "easy", "Three", "One", "Five", "Ten", "Three takeoffs and landings within the previous 90 days is the standard requirement."],
      ["The Certificate of Airworthiness remains valid provided:", "medium", "The aircraft is maintained per the approved programme", "The owner does not change", "It is renewed every month", "The aircraft stays in one country", "Continued validity depends on maintenance in accordance with the approved schedule."]
    ]
  },
  TGN: {
    "Powerplant": [
      ["The primary purpose of a fuel control unit on a turbine engine is to:", "medium", "Meter fuel flow to the burners", "Cool the turbine section", "Filter engine oil", "Drive the accessory gearbox", "The FCU schedules fuel against throttle position, air density and engine speed."],
      ["Detonation in a piston engine is:", "medium", "Spontaneous explosive burning of the remaining charge", "Combustion that is too rich", "A drop in oil pressure", "Excessive cylinder cooling", "The end gas ignites spontaneously and burns explosively, raising pressure and temperature sharply."],
      ["A constant speed propeller holds RPM by varying:", "easy", "Blade pitch", "Fuel flow", "Ignition timing", "Intake length", "The governor adjusts blade angle so engine speed stays at the selected RPM."],
      ["The compression ratio of a turbine engine refers to:", "hard", "Compressor outlet to inlet pressure", "Fuel to air mass ratio", "Turbine to compressor speed", "Exhaust to inlet temperature", "It is the total pressure rise across the compressor section."],
      ["Magneto ignition is used on piston aero engines mainly because it:", "medium", "Is independent of the electrical system", "Produces more power", "Reduces fuel burn", "Simplifies cooling", "A magneto generates its own current, so ignition survives a complete electrical failure."]
    ],
    "Airframe and systems": [
      ["A fail safe structure is one that:", "medium", "Carries load by an alternative path after a failure", "Can never fail", "Is replaced on a fixed calendar schedule", "Is built only from composites", "Redundant load paths let the structure survive a single member failure until inspection finds it."],
      ["The purpose of an oleo shock strut is to:", "easy", "Absorb landing energy", "Steer the nosewheel", "Apply the brakes", "Retract the landing gear", "Oil forced through an orifice with compressed gas dissipates the vertical energy of touchdown."],
      ["Typical hydraulic system pressure in a large transport aircraft is about:", "medium", "3000 psi", "300 psi", "150 psi", "10000 psi", "3000 psi is the long standing standard, with some newer types running 5000 psi."],
      ["The main purpose of a bonding strip is to:", "medium", "Provide a common electrical path between components", "Add structural strength", "Reduce weight", "Seal against fuel leaks", "Bonding equalises electrical potential so static discharge and lightning current pass safely."]
    ]
  },
  TSP: {
    "Performance": [
      ["V1 is defined as:", "medium", "Takeoff decision speed", "Rotation speed", "Stalling speed in the takeoff configuration", "Best rate of climb speed", "V1 is the latest speed at which a stop can be started within the accelerate stop distance available."],
      ["Increasing pressure altitude at constant mass will:", "easy", "Increase takeoff distance", "Decrease takeoff distance", "Leave it unchanged", "Reduce rotation speed", "Lower air density cuts thrust and lift, so the takeoff run lengthens."],
      ["For a jet aircraft, the speed for maximum range is found:", "hard", "Where a tangent from the origin meets the drag curve", "At minimum drag speed", "Just above the stall", "At maximum level speed", "For a jet the best range speed lies at the tangent point, above minimum drag speed."],
      ["A contaminated runway primarily affects takeoff by:", "medium", "Reducing braking action and adding drag", "Increasing available thrust", "Reducing required rotation speed", "Increasing air density", "Standing water or slush both slow acceleration and degrade stopping performance."]
    ],
    "Mass and balance": [
      ["Moving the centre of gravity aft will generally:", "medium", "Reduce longitudinal stability", "Increase the stalling speed", "Increase drag at every speed", "Shorten range", "An aft CG shortens the tail arm, which reduces static longitudinal stability."],
      ["Basic empty mass includes:", "easy", "Unusable fuel and full operating fluids", "Crew and baggage", "The traffic load", "All usable fuel", "It covers airframe, engines, fixed equipment, unusable fuel and full operating fluids."],
      ["Loading an aircraft beyond its aft CG limit most likely results in:", "hard", "Difficulty recovering from a stall", "A higher stalling speed", "Nose heavy handling", "Reduced climb rate only", "With an aft CG the elevator may lack authority to lower the nose, making stall recovery difficult."],
      ["The datum used for mass and balance calculations is:", "easy", "An arbitrary reference chosen by the manufacturer", "Always the nose of the aircraft", "Always the centre of gravity", "Always the main wheels", "The datum is arbitrary but fixed, and all arms are measured from it."]
    ]
  },
  RTR: {
    "Phraseology": [
      ["What is the correct read back for a clearance to line up and wait?", "easy", "Lining up and waiting, with callsign", "Roger", "Wilco", "Taking off, with callsign", "Runway entry clearances must be read back in full together with the callsign."],
      ["The word ROGER means:", "easy", "I have received all of your last transmission", "I will comply", "That is correct", "Say again", "ROGER confirms receipt only. WILCO adds that the instruction will be complied with."],
      ["The correct phrase to ask for a message to be repeated is:", "easy", "Say again", "Repeat", "Come again", "Confirm", "REPEAT is avoided because of its artillery meaning, so SAY AGAIN is standard."],
      ["Flight level 100 is spoken as 'flight level one hundred' in order to:", "medium", "Avoid confusion with other similar levels", "Save transmission time", "Comply with Annex 5 only", "Assist non English speakers only", "Speaking hundreds as such prevents ambiguity between similar sounding level readouts."],
      ["A read back is required for:", "medium", "Route and holding instructions and level clearances", "Only weather information", "Only traffic information", "Nothing, acknowledgement is enough", "Safety critical clearances such as levels, headings, routes and runway instructions must be read back."]
    ],
    "Distress and urgency": [
      ["The distress signal, spoken three times, is:", "easy", "MAYDAY", "PAN PAN", "SECURITE", "EMERGENCY", "MAYDAY spoken three times denotes grave and imminent danger requiring immediate assistance."],
      ["PAN PAN indicates:", "easy", "Urgency without immediate danger", "Grave and imminent danger", "A routine radio check", "A position report", "It signals urgency concerning the aircraft or a person without requiring immediate assistance."],
      ["The transponder code for radio communication failure is:", "medium", "7600", "7700", "7500", "7000", "7500 is unlawful interference, 7600 radio failure and 7700 general emergency."],
      ["On losing two way communication in IMC, the pilot should:", "medium", "Squawk 7600 and follow the published procedure", "Land immediately at the nearest field", "Descend below cloud at once", "Continue without any change", "Squawk 7600 and comply with the published communication failure procedure for the airspace."]
    ]
  }
};
