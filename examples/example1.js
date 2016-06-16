/*
* Simple example of an array of objects which contain a child object that is
* referenced by both parent objects.
*/

var example1 = [
	{
		"id": 8,
		"firstName": "James",
		"lastName": "Emmrich",
		"class": {
			"@id": 1,
			"id": 6,
			"room": "Math"
		}
	},
	{
		"id": 9,
		"firstName": "Gary",
		"lastName": "Wright",
		"class": 1
	}
];
