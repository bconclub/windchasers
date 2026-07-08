export interface FeaturedSchool {
  id: string;
  country: string;
  place: string;
  name: string;
  about: string;
  website: string;
  image: string | null;
  rating: number | null;
  mapsUrl: string | null;
}

// Curated by the brand -- the schools WindChasers actively features and
// vouches for, separate from the wider auto-imported directory below.
// image/rating/mapsUrl enriched from Google Places (scripts/enrich-featured-schools.mjs).
export const FEATURED_SCHOOLS: FeaturedSchool[] = [
  {
    id: "featured-1",
    country: "United States",
    place: `CALIFORNIA`,
    name: `SKYVIEW AVIATION`,
    about: `SkyView Aviation is a well-recognized flight training organization in the United States, dedicated to providing high-quality pilot training in a professional and student-focused environment. The academy offers structured flight training programs for aspiring pilots, from Private Pilot Licence (PPL) through Commercial Pilot Licence (CPL) and advanced flight ratings. With modern aircraft, experienced instructors, and a strong emphasis on safety, SkyView Aviation prepares students to meet international aviation standards.

Students benefit from hands-on flight training, comprehensive ground school instruction, and personalized guidance throughout their aviation journey. The academy focuses on building technical competence, sound decision-making skills, and confidence in real-world flying environments. Training is conducted in controlled airspace, giving students valuable operational experience while enhancing their communication and situational awareness.

SkyView Aviation attracts students from around the world by offering flexible training schedules, efficient course structures, and dedicated student support services. International students receive assistance with admissions, visa processes, accommodation guidance, and training progression, making the transition to studying abroad smoother and more comfortable.

The academy's modern training philosophy combines practical flying experience with theoretical knowledge, ensuring graduates are well prepared for professional careers in aviation. Through continuous mentoring and high instructional standards, students develop the skills required to pursue opportunities with airlines and aviation organizations worldwide.

For aspiring commercial pilots seeking internationally recognized flight training in the United States, SkyView Aviation provides an excellent platform to begin a successful aviation career.`,
    website: "https://skyviewaviation.com/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-1.jpg",
    rating: 4.5,
    mapsUrl: "https://maps.google.com/?cid=10836659184382565632&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-2",
    country: "United States",
    place: `CALIFORNIA`,
    name: `ADVANCED INTERNATIONAL AVIATION ACADEMY`,
    about: `AI Aviation Academy is committed to developing future aviation professionals through industry-oriented education and practical training. The academy offers comprehensive aviation programs designed to equip students with the technical knowledge, communication skills, and professional attitude required to succeed in today's competitive aviation industry.

Its training methodology combines classroom instruction with practical exposure, allowing students to gain a deeper understanding of aviation operations and industry best practices. Students receive guidance from experienced aviation professionals who emphasize safety, discipline, teamwork, and operational excellence throughout the learning process.

In addition to technical training, the academy places significant focus on personality development, grooming, communication skills, interview preparation, and career readiness. This holistic approach helps students build confidence while preparing them for airline recruitment processes and various aviation career opportunities.

AI Aviation Academy aims to create an engaging learning environment where students are encouraged to develop both professionally and personally. The academy continuously updates its curriculum to align with evolving industry standards and employer expectations, ensuring graduates remain competitive in the global aviation sector.

With a commitment to quality education and student success, AI Aviation Academy supports aspiring aviation professionals in achieving their career goals through structured learning, practical experience, and dedicated mentorship.`,
    website: "https://www.aiaviationacademy.com/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-2.jpg",
    rating: 4.9,
    mapsUrl: "https://maps.google.com/?cid=5486386911136841482&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-3",
    country: "United States",
    place: `CALIFORNIA`,
    name: `ORANGE COUNTY FLIGHT CENTRE`,
    about: `Orange County Flight Center (OCFC) is one of California's leading FAA-approved flight training organizations, located at the renowned John Wayne Airport in Southern California. The academy offers comprehensive flight training programs ranging from Private Pilot Licence (PPL) to Commercial Pilot Licence (CPL), Instrument Rating, Multi-Engine Rating, Certified Flight Instructor (CFI), and Airline Transport Pilot (ATP) training.

Training at a busy commercial airport provides students with valuable exposure to real airline operations, controlled airspace, advanced air traffic control communication, and complex flight environments. This practical experience helps students develop professional flying skills while preparing them for airline careers.

OCFC operates under both FAA Part 141 and Part 61 training programs, allowing students to choose a learning pathway that best suits their career objectives. The academy maintains a modern fleet of training aircraft, experienced FAA-certified instructors, and a structured curriculum focused on safety, professionalism, and operational excellence.

International students receive dedicated support throughout the admission process, including guidance on training requirements and accommodation assistance. The academy's emphasis on individualized instruction, disciplined flight training, and career-oriented development has made it a preferred destination for aspiring pilots from around the world.

With its excellent training facilities, strong safety culture, and professional learning environment, Orange County Flight Center continues to prepare students for successful careers in commercial aviation.`,
    website: "https://ocfc.com/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-3.jpg",
    rating: 4.1,
    mapsUrl: "https://maps.google.com/?cid=11800015798055992103&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-4",
    country: "United States",
    place: `FLORIDA`,
    name: `Wayman College of Aeronautics`,
    about: `Wayman Aviation Academy is an FAA-certified flight school based in Florida, USA, with decades of experience in training aspiring pilots from across the globe. The academy offers a complete range of professional pilot training programs, including Private Pilot Licence, Instrument Rating, Commercial Pilot Licence, Multi-Engine Rating, Flight Instructor certifications, and Airline Career Pathway programs.

Known for its multicultural learning environment and experienced instructor team, Wayman Aviation Academy combines high academic standards with practical flight experience. Students train using a modern fleet of aircraft while gaining valuable operational knowledge in diverse flying conditions.

The academy provides comprehensive support services for international students, including visa guidance, accommodation assistance, and academic counseling. Its structured training approach enables students to progress efficiently while maintaining a strong focus on safety, regulatory compliance, and professional development.

Wayman Aviation Academy also collaborates with educational institutions and aviation organizations, creating opportunities for students to pursue advanced education alongside flight training. The academy emphasizes leadership, discipline, technical proficiency, and decision-making skills that are essential for professional airline pilots.

Graduates leave the academy with internationally recognized FAA certifications and the practical experience required to pursue aviation careers worldwide. Wayman Aviation Academy continues to be a trusted choice for students seeking quality flight training in the United States.`,
    website: "https://wayman.edu/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-4.jpg",
    rating: 4.3,
    mapsUrl: "https://maps.google.com/?cid=17413812784427169002&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-5",
    country: "United States",
    place: `FLORIDA`,
    name: `American Aviation Academy`,
    about: `American Aviation Flight Academy (AAFA) provides professional flight training designed to prepare students for successful careers in commercial aviation. The academy offers comprehensive programs that cover every stage of pilot development, from foundational flight training to advanced commercial certifications.

Students benefit from structured ground school education, hands-on flight instruction, and personalized mentoring by experienced aviation professionals. The academy places strong emphasis on safety, operational discipline, and practical decision-making, ensuring graduates develop the confidence required for professional flying.

AAFA maintains modern training standards and continuously updates its instructional methods to reflect current aviation regulations and industry practices. Students gain valuable experience operating in real flight environments while building technical competence and aviation professionalism.

Beyond flight instruction, the academy supports students with career guidance, interview preparation, and professional development programs that enhance employability within the aviation sector. International students receive assistance throughout their training journey, including admissions support and student services.

Through a balanced combination of theoretical knowledge and practical flight experience, American Aviation Flight Academy prepares aspiring pilots to meet global aviation standards and pursue rewarding careers with airlines and aviation organizations around the world.`,
    website: "https://flyaafa.com/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-5.jpg",
    rating: 4.2,
    mapsUrl: "https://maps.google.com/?cid=6886397213748437141&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-6",
    country: "United States",
    place: `FLORIDA`,
    name: `Skyduo Flight Academy`,
    about: `SkyDuo Academy is an aviation education institution focused on delivering modern, industry-relevant training for aspiring aviation professionals. The academy emphasizes practical learning, professional development, and high instructional standards to prepare students for successful careers in the aviation sector.

Its programs are designed to combine aviation theory with real-world application, enabling students to build a solid understanding of flight operations, aviation safety, communication, and operational procedures. Experienced instructors mentor students throughout their training while encouraging discipline, confidence, and continuous learning.

SkyDuo Academy also recognizes the importance of soft skills in aviation careers. Students receive training in personality development, teamwork, leadership, professional grooming, and interview preparation, ensuring they are ready for airline recruitment and workplace expectations.

The academy strives to create a supportive learning environment where students receive personalized attention and guidance. Modern teaching methods, updated curriculum, and practical exposure help students develop both technical knowledge and professional competence.

With a commitment to excellence in aviation education, SkyDuo Academy aims to produce graduates who are prepared to meet the evolving demands of the global aviation industry and confidently pursue opportunities across various sectors of aviation.`,
    website: "https://www.skyduoacademy.com/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-6.jpg",
    rating: 4.8,
    mapsUrl: "https://maps.google.com/?cid=14738627198100763467&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-7",
    country: "New Zealand",
    place: `Oamaru`,
    name: `New Zealand Airline Academy`,
    about: `New Zealand Airline Academy (NZAAL) is a leading flight training institution located in Oamaru, New Zealand, offering internationally recognized pilot training programs for aspiring aviation professionals. Established by experienced aviation experts, the academy combines over three decades of industry knowledge with modern training methodologies to prepare students for successful careers in commercial aviation.

NZAAL provides comprehensive training pathways including the Private Pilot Licence (PPL), Commercial Pilot Licence (CPL), Instrument Rating (IR), Instructor Rating, Frozen ATPL, and Multi-Crew Cooperation (MCC) programs. Students train on a technologically advanced fleet equipped with modern glass cockpit avionics, helping them develop the practical skills required in today's airline industry.

The academy places a strong emphasis on safety, professionalism, and operational excellence while offering personalized instruction from highly experienced flight instructors. International students benefit from dedicated support with admissions, accommodation, and training guidance, ensuring a smooth learning experience. With New Zealand's diverse weather conditions and scenic flying environment, NZAAL provides students with valuable exposure that helps build confidence, technical proficiency, and sound decision-making skills for a successful aviation career.`,
    website: "https://www.nzaal.co.nz/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-7.jpg",
    rating: 4.5,
    mapsUrl: "https://maps.google.com/?cid=16277929724297540050&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-8",
    country: "New Zealand",
    place: `Auckland`,
    name: `Airdmore Flying School`,
    about: `Ardmore Flying School is one of New Zealand's most respected flight training institutions, with a proud history of training professional pilots since 1961. Located at Ardmore Airport near Auckland, the academy has built an international reputation for delivering high-quality aviation education through experienced instructors, modern aircraft, and structured training programs.

The school offers comprehensive pilot training from Private Pilot Licence (PPL) through Commercial Pilot Licence (CPL), Instrument Rating, Multi-Engine Rating, and Flight Instructor qualifications. Students receive extensive ground school instruction combined with practical flight experience, enabling them to develop strong technical knowledge, operational skills, and professional confidence.

Ardmore Flying School is committed to maintaining the highest standards of safety, professionalism, and student success. Its modern training facilities, advanced simulators, and well-maintained fleet provide an ideal learning environment for both domestic and international students. With a focus on producing safe, competent, and career-ready pilots, Ardmore Flying School continues to be a preferred destination for aspiring aviators seeking internationally recognized flight training in New Zealand.`,
    website: "https://ardmore.co.nz/contact/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-8.jpg",
    rating: 4.5,
    mapsUrl: "https://maps.google.com/?cid=7908559733709681399&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-9",
    country: "New Zealand",
    place: `Auckland`,
    name: `AIPA`,
    about: `Auckland International Pilot Academy (AIPA) is a modern flight training institution based in Auckland, New Zealand, offering internationally recognized pilot training programs for students pursuing careers in commercial aviation. Built on more than 60 years of flight training heritage through its association with the North Shore Aero Club, AIPA combines decades of experience with contemporary aviation education.

The academy offers structured aviation diploma programs, Commercial Pilot Licence (CPL) pathways, Flight Instructor training, and specialized programs designed for both domestic and international students. Students benefit from experienced instructors, a strong safety culture, and training in New Zealand's diverse flying conditions, helping them develop excellent operational and decision-making skills.

AIPA maintains close relationships with airlines and aviation organizations, creating valuable industry exposure and career development opportunities for its graduates. The academy emphasizes professionalism, technical competence, leadership, and continuous learning while providing a supportive and student-focused environment. With modern facilities, comprehensive training programs, and a commitment to excellence, AIPA prepares aspiring pilots with the knowledge, confidence, and practical experience needed to succeed in the global aviation industry.`,
    website: "https://www.aipa.ac.nz/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-9.jpg",
    rating: 3.5,
    mapsUrl: "https://maps.google.com/?cid=13834113618320344090&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-10",
    country: "South Africa",
    place: `Johannesburg`,
    name: `VULCAN AVIATION`,
    about: `Vulcan Aviation is a SACAA-approved flight training academy based at Lanseria International Airport, Johannesburg, South Africa. Renowned for its student-focused approach and modern training infrastructure, the academy offers comprehensive pilot training programs designed to prepare aspiring aviators for successful careers in commercial aviation. With experienced instructors, advanced training aircraft, and a strong emphasis on safety, Vulcan Aviation provides students with a professional learning environment that meets international aviation standards.

The academy offers a complete range of flight training programs, including Private Pilot Licence (PPL), Commercial Pilot Licence (CPL), Instrument Rating, Night Rating, Multi-Engine Rating, and Airline Transport Pilot Licence (ATPL) pathways. Students benefit from structured ground school, simulator training, and practical flying experience in diverse operational environments.

Vulcan Aviation also provides dedicated support for international students, including guidance with admissions, accommodation, visa assistance, and DGCA-compliant training pathways for Indian students. By combining high-quality instruction, personalized mentoring, and a commitment to operational excellence, the academy equips graduates with the technical knowledge, confidence, and professional skills required to pursue rewarding careers with airlines and aviation organizations worldwide.`,
    website: "https://www.flyvulcan.co.za/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-10.jpg",
    rating: 3.8,
    mapsUrl: "https://maps.google.com/?cid=15899803477673075933&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-11",
    country: "South Africa",
    place: `Vereeniging`,
    name: `UNITAS FLYING SCHOOL`,
    about: `Unitas Flying School (UFA) is a SACAA-approved aviation training academy located at Vereeniging Airport in Gauteng, South Africa. Established in 2009, the academy has earned a reputation for delivering quality pilot training through experienced instructors, structured learning programs, and a strong commitment to safety, integrity, and professionalism. Its training environment allows students to build confidence in both uncontrolled and controlled airspace operations, providing valuable real-world flying experience.

The academy offers a comprehensive range of aviation courses, including Private Pilot Licence (PPL), Commercial Pilot Licence (CPL), Instrument Rating, Night Rating, Multi-Engine Rating, ATPL theory, Multi-Crew Cooperation (MCC), Radio Telephony, and English Language Proficiency training. Students receive extensive ground school instruction alongside practical flight training, ensuring a well-rounded aviation education.

Unitas Flying School places significant emphasis on personalized instruction and student development while maintaining internationally recognized training standards. With modern facilities, dedicated student support services, and a focus on producing safe and competent pilots, UFA provides aspiring aviators with the skills, knowledge, and confidence needed to build successful careers in the global aviation industry.`,
    website: "https://flyufa.co.za/",
    image: null,
    rating: 4.8,
    mapsUrl: "https://maps.google.com/?cid=10960249434316646398&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-12",
    country: "Maldives",
    place: `Gan`,
    name: `Zenith Aviation Academy`,
    about: `Zenith Aviation Academy is a modern aviation training institution located at Gan International Airport in Addu, Maldives. Strategically positioned on the equator, the academy offers year-round flying conditions, allowing students to maximize flight training with minimal weather interruptions. Designed to provide internationally aligned pilot training, Zenith combines experienced instructors, advanced facilities, and a structured learning environment to prepare aspiring pilots for successful careers in commercial aviation.

The academy offers both Integrated and Modular Commercial Pilot Licence (CPL) programs, along with Instrument Rating (IR), Multi-Engine Rating (MEP), Airline Transport Pilot (ATPL) Theory, Flight Instructor (FI) training, and other advanced aviation courses. Students receive comprehensive ground school instruction, simulator training, and practical flight experience using a modern fleet of aircraft, ensuring they develop the technical knowledge, confidence, and operational skills expected in today's aviation industry.

Zenith Aviation Academy places a strong emphasis on safety, personalized mentorship, and career-focused training. International students are supported throughout their journey with assistance for admissions, accommodation, and visa processes, creating a seamless learning experience. With its unique equatorial location, modern infrastructure, and commitment to training excellence, Zenith Aviation Academy provides aspiring pilots with an ideal environment to build the skills and professionalism required for opportunities in the global aviation ind`,
    website: "https://zenithaviation.net/",
    image: null,
    rating: 2.3,
    mapsUrl: "https://maps.google.com/?cid=2762197361453538111&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-13",
    country: "Europe",
    place: `Spain`,
    name: `Barcelona flight School`,
    about: `Barcelona Flight School (BFS) is one of Spain's most established EASA-approved flight training organizations, with over 70 years of experience in developing professional pilots. Located at Sabadell Airport near Barcelona, the academy offers internationally recognized pilot training in a modern, multicultural environment. With a fleet of more than 40 aircraft, advanced training facilities, and highly experienced instructors, BFS is committed to delivering high-quality aviation education that meets European and global industry standards.

The academy offers integrated and modular training pathways, including Private Pilot Licence (PPL), Commercial Pilot Licence (CPL), Airline Transport Pilot Licence (ATPL), Instrument Rating (IR), Multi-Engine Rating (ME), Multi-Crew Cooperation (MCC), and Flight Instructor (FI) programs. Students benefit from comprehensive ground school, simulator training, and practical flight instruction designed to develop strong technical knowledge, operational competence, and professional confidence.

Barcelona Flight School also provides dedicated support for international students, including assistance with accommodation and visa guidance. With excellent flying weather, world-class facilities, and a strong focus on safety, flexibility, and career readiness, BFS offers aspiring pilots an ideal platform to pursue successful careers in commercial aviation.`,
    website: "https://barcelonaflightschool.com/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-13.jpg",
    rating: 4.4,
    mapsUrl: "https://maps.google.com/?cid=13009288771164476520&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-14",
    country: "Europe",
    place: `Hungary`,
    name: `Pharma Flight School`,
    about: `PHARMAFLIGHT Aviation Academy is an innovative aviation education and research institution headquartered in Debrecen, Hungary. Recognized for its unique approach to aviation training, the academy integrates pilot education with advanced simulation, aviation medicine, and human performance research. Its vision, "Fly by Comfort," reflects its commitment to improving aviation safety by enhancing the physical, mental, and operational performance of flight crews.

The academy offers university-level pilot education supported by state-of-the-art flight simulators, aviation medical services, and research facilities. Students receive comprehensive theoretical instruction and practical training in an environment that combines academic excellence with the latest developments in aviation science and technology. This multidisciplinary approach helps prepare future pilots to meet the evolving demands of the global aviation industry.

PHARMAFLIGHT places a strong emphasis on innovation, safety, and professional development while fostering collaboration between aviation, healthcare, and scientific research. Through its modern infrastructure and internationally oriented programs, the academy equips aspiring aviation professionals with the knowledge, skills, and confidence required for successful careers in commercial aviation.`,
    website: "https://pharmaflightindia.in/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-14.jpg",
    rating: 4.1,
    mapsUrl: "https://maps.google.com/?cid=9338409075528866467&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-15",
    country: "India",
    place: ``,
    name: `SKYNEX AERO`,
    about: `Skynex Aero is a DGCA-approved Flight Training Organization (FTO) dedicated to shaping the next generation of professional pilots through world-class aviation education and modern flight training. Established in 2019, the academy became the first flight school approved under the Airports Authority of India's Atmanirbhar Bharat initiative, reflecting its commitment to strengthening India's aviation ecosystem. With training bases in Jalgaon (Maharashtra), Mehsana (Gujarat), and expanding operations across the country, Skynex provides students with a dynamic learning environment supported by advanced infrastructure and experienced instructors.

The academy offers a comprehensive range of pilot training programs, including Private Pilot Licence (PPL), Commercial Pilot Licence (CPL), Instrument Rating (IR), Flight Instructor Rating (FIR), License Conversion, and DGCA Ground School. Students train on a modern fleet featuring Garmin G1000 glass cockpit aircraft, advanced simulators, and an in-house CAR 145 maintenance facility, ensuring a seamless and industry-relevant learning experience.

Skynex Aero emphasizes safety, innovation, and personalized mentorship while preparing students for successful careers in commercial aviation. By combining cutting-edge technology, structured training, and operational excellence, the academy equips aspiring pilots with the technical expertise, confidence, and professionalism required to meet global aviation standard`,
    website: "https://skynex.aero/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-15.jpg",
    rating: 4.4,
    mapsUrl: "https://maps.google.com/?cid=6414738671294892484&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-16",
    country: "India",
    place: ``,
    name: `AARNA FLYING SCHOOL`,
    about: ``,
    website: "",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-16.jpg",
    rating: 4.9,
    mapsUrl: "https://maps.google.com/?cid=6602884732760180520&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-17",
    country: "India",
    place: ``,
    name: `Asia Pacific flight training school`,
    about: `Asia Pacific Flight Training Academy (APFT) is a DGCA-approved Flight Training Organization committed to delivering high-quality pilot training that meets national and international aviation standards. With operations at Kalaburagi Airport in Karnataka, Begumpet Airport, and Rajiv Gandhi International Airport in Hyderabad, APFT provides students with diverse flying environments that help build strong operational skills and real-world experience. Guided by a vision of producing skilled, disciplined, and safety-conscious aviation professionals, the academy has established itself as one of India's trusted pilot training institutions.

APFT offers comprehensive training programs including Private Pilot Licence (PPL), Commercial Pilot Licence (CPL), Instrument Rating (IR), Multi-Engine Rating (ME), and Airline Transport Pilot Licence (ATPL) theory. Students train on a modern fleet of Diamond DA40D and DA42 aircraft, supported by experienced instructors, structured ground school, and advanced training methodologies designed to prepare them for successful airline careers.

The academy places a strong emphasis on professionalism, technical excellence, and safety while providing personalized guidance throughout each student's training journey. With modern facilities, experienced faculty, and a student-centric approach, APFT equips aspiring pilots with the knowledge, confidence, and practical skills required to excel in the global aviation industry.`,
    website: "https://apft.edu.in/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-17.jpg",
    rating: 4.1,
    mapsUrl: "https://maps.google.com/?cid=17206705633753173452&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
  {
    id: "featured-18",
    country: "Philippines",
    place: `Dumaguete City`,
    name: `Royhale flying school`,
    about: `Royhle Aviation Academy is a CAAP-certified flight training institution based in Dumaguete, Philippines, dedicated to providing high-quality pilot training for aspiring aviation professionals from around the world. Established in 2013, the academy has built a strong reputation for its student-centric approach, modern training methodologies, and commitment to safety and operational excellence. With experienced instructors and a well-maintained training fleet, Royhle offers an ideal learning environment for students pursuing careers in commercial aviation.

The academy offers a comprehensive range of pilot training programs, including Private Pilot Licence (PPL), Commercial Pilot Licence (CPL), Instrument Rating (IR), Multi-Engine Rating (ME), Flight Instructor Rating (FI), Airline Transport Pilot Licence (ATPL) Theory, Multi-Crew Cooperation (MCC), Jet Familiarization, and Foreign Licence Validation. Its structured curriculum combines in-depth ground school, practical flight training, and personalized mentorship to ensure students develop strong technical knowledge, professional discipline, and operational confidence.

Royhle Aviation Academy also provides dedicated support for international students, including assistance with admissions, accommodation, and training guidance. With its modern facilities, favorable flying conditions, and focus on producing competent, airline-ready pilots, the academy equips graduates with the knowledge, skills, and professionalism required to succeed in the global aviation industry`,
    website: "https://royhleaviation.com/Academy/",
    image: "https://ebxslycxbgvjrkirrizd.supabase.co/storage/v1/object/public/school-photos/featured/featured-18.png",
    rating: 4.6,
    mapsUrl: "https://maps.google.com/?cid=8374629162679604731&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
  },
];
