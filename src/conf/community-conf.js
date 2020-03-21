
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
};

export default community_config;
