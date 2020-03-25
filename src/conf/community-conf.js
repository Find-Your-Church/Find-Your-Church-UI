
const community_config = {
	SOCIALS: [
		"Website", "Facebook", "Instagram", "Vimeo", "Youtube", "Twitter", "Podcast",
	],

	/**
	 * must include at least 1 category.
	 */
	CATEGORIES: [
		"Churches", "Youth Groups", "Young Adult Groups", "Focus Groups", "Life Groups", "Support Groups", "Events",
	],

	SEARCH_RADIUS: [
		1, 3, 5, 10, 20, 30,// 5000 are for testing
	],

	FILTERS: {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		times: ["Morning", "Afternoon", "Evening"],
		frequency: ["Once", "Weekly", "Bi-Weekly", "Monthly", "Quarterly"],
		ages: ["All", "Elementary", "Jr. High", "High School", "Young Adult", "20's", "30's", "40's", "50's", "60's", "Retired"],
		gender: ["Co-ed", "Men", "Women"],
		parking: ["Street", "Parking Lot", "Parking Ramp", "Handicap", "Drop-off / Pick-up Zone"],
		ministries: ["Sunday School", "Youth Groups", "Young Adults", "Small Groups", "Life Groups", "Support Groups", "Alpha"],
		other_services: ["Child Care", "First Communion", "Wedding Ceremony's", "Marriage Counseling", "Financial Consult", "Event / Space Rental"],
		average_attendance: 0,
		ambiance: ["Contemporary", "Traditional", "Both-Separate", "Both-Combined"],
		event_type: ["Social", "Worship", "Guest Speaker", "Concert", "Fundraiser", "Conference", "Community Outreach", "Recreational Sports"],
		support_type: ["Divorce", "Addiction", "Death / Grief", "LGBTQ", "Marriage"]
	},

	FILTERS4URL: {
		days: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
		times: ["morning", "afternoon", "evening"],
		frequency: ["once", "weekly", "bi_weekly", "monthly", "quarterly"],
		ages: ["all_ages", "elementary", "jr_high", "high_school", "young_adult", "20s", "30s", "40s", "50s", "60s", "retired"],
		gender: ["co_ed", "men", "women"],
		parking: ["street", "parking_lot", "parking_ramp", "handicap", "drop_off_pick_up_zone"],
		ministries: ["sunday_school", "youth_groups", "young_adults", "small_groups", "life_groups", "support_groups", "alpha"],
		other_services: ["child_care", "first_communion", "wedding_ceremony_s", "marriage_counseling", "financial_consult", "event_space_rental"],
		ambiance: ["contemporary", "traditional", "both_separate", "both_combined"],
		event_type: ["social", "worship", "guest_speaker", "concert", "fundraiser", "conference", "community_outreach", "recreational_sports"],
		support_type: ["divorce", "addiction", "death_grief", "lgbtq", "marriage"]
	},
};

export default community_config;
