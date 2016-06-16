# Dejacksonify
Expands JSON from Jackson in cases where `@JsonIdentityInfo` has been used to prevent recursive json output.

Author: James Emmrich <jemmrich@gmail.com>

Date: May 16th 2016

## Purpose
When creating domain objects in java you can use `@JsonIdentityInfo` to create `@id`'s for objects. This prevents scenarios where objects refer to the same type of object causing an endless loop of json output. The id's are generated sequentially and set for each one of these domain objects. The identifier property can be customized to whatever you like.
eg:
```
@JsonIdentityInfo(generator=ObjectIdGenerators.IntSequenceGenerator.class, property="@id")
```
Ultimately you are left with not only a smaller json object but one that does not have complete objects. See examples.

# Usage

## Example 1
Return a complete json document with all objects repaired
```
var json = new Dejacksonify(example1, "id");
console.log(json.getResult());
```

## Example 2
Do not convert the whole json document, only return only the object that we need
```
var json = new Dejacksonify(example1, "id");
result = json.findObject(id, example1);
console.log(result);
```
# Features
* The identifier that is parsed is customizable according to your implementation of it in your domain model
* Allows you to parse json objects, or a json array or objects
* You can grab just the object you want by passing the id and calling findObject as in example 2

# Notes
* Would like to create more examples and test edge case scenarios

# References
* http://wiki.fasterxml.com/JacksonFeatureObjectIdentity
* Discussion about circular references and how it works - https://dzone.com/articles/circular-dependencies-jackson
* http://stackoverflow.com/questions/24208167/deserialize-jackson-object-in-javascript-containing-jsonidentityinfo
* http://jsfiddle.net/rodgolpe/5e7Vn/2/
