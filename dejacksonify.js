/*
* Author: James Emmrich <jemmrich@gmail.com>
* Date: May 16th 2016
*
* Purpose:
* When creating domain objects in java you can use @JsonIdentityInfo to create
* @id's for objects. This prevents scenerios where objects refer to the same
* type of object causing an endless loop of json output. The id's are generated
* sequentially and set for each one of these domain objects. The identifier
* property can be customized to whatever you like.
* eg:
* 	@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@id")
*
* Ultimately you are left with not only a smaller json object but one that does
* not have complete objects. See examples.
*
* Usage:
* // Return a complete json document with all objects repaired
* var json = new Dejacksonify(example1, "id");
* console.log(json.getResult());
*
* // Do not convert the whole json document, only return
* // only the object that we need
* var json = new Dejacksonify(example1, "id");
* result = json.findObject(id, example1);
* console.log(result);
*
* References:
*  * http://wiki.fasterxml.com/JacksonFeatureObjectIdentity
*
* MIT License
*
* Copyright (c) 2016 James Emmrich <jemmrich@gmail.com>
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
Dejacksonify = function(json, identifier){
	this.identifier = "id";	// Jackson identifier
	this.data = "";			// The data we are working with
	this.result = [];		// Our result
	
	if(identifier !== null)
		this.identifier = identifier;

	if(json !== null){
		this.data = json;

		// Loop through the array of json objects
		if(Array.isArray(this.data)){
			for(var i = 0; i < this.data.length; i++){
				var result = this.parseJson(null, this.data[i]);
				this.result.push(result);
			}
		}else{
			this.result = this.parseJson(null, this.data);
		}
	}
};

/*
* Return results
* @return	{object}	Json object that has been parsed
*/
Dejacksonify.prototype.getResult = function(){
	return this.result;
};

/*
* Recursively parses the json object cloning objects that were serialized by jackson.
* @propertyName	{string}	Name of property
* @json			{json}		Json object to parse
* @return		{object}	Json object that has been parsed
*/
Dejacksonify.prototype.parseJson = function(propertyName, json){
	// The object we'll return
	var obj = {};

	// Loop through each property
	for (var prop in json) {

		// If property typeof == object, call parse with that object starting this over
		if(typeof json[prop] === "object"){
			obj[prop] = this.parseJson(prop, json[prop]);

		// If property typeof === number and is not an @property, call findObject method.
		// We have to assume this property could be an object. If nothing is returned,
		// then it must not be, so we store the original value.
		}else if(typeof json[prop] === "number" && !prop.startsWith("@")){
			var result = this.findObject(json[prop], this.data);

			// If findObject returns something, set property to object
			if(result !== undefined){
				if(propertyName !== null){
					obj[propertyName] = result;
				}else{
					obj[prop] = result;
				}
			}else{
				// Store the original key/value
				obj[prop] = json[prop];
			}

		}else{
			// Store the original key/value
			obj[prop] = json[prop];
		}

	}

	return obj;
};

/*
* Finds an object that matches the id that was passed.
* @id		{number}		ID of object to find
* @json		{json}			Whole json document
* @return	{object/null}	Returns object if found, null otherwise
*/
Dejacksonify.prototype.findObject = function(id, json) {
	if(id !== null && id !== undefined && typeof id === "object")
		return id;

	if(!(json && typeof json == "object"))
		return;

	if(json['@' + this.identifier] === id)
		return json;

	for(var x in json){
		if(Object.hasOwnProperty.call(json, x)) {
			var result = this.findObject(id, json[x]);

			if(result !== undefined)
				return result;
		}
	}
};
