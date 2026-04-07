
let name1="milli"
let age=20
console.log("My name is " + name1 + "and my age is " + age);
var students={
    name2:"Ali",
    marks:85,
    subject: "Computer sceince"

};
console.log(students["name2"])
console.log(students.marks)
students.city="lahore"
console.log(students.city)
students.ispresent=true
console.log(students.ispresent)

function greet(name){
    return "hello " + name
}
console.log(greet("Malaiaka"))

// null -- let data = null ; console.log(data) value exist but null
// undefined let x; undefiend we declare variable but not defined
let s=" Connie Client "
var len = s.length
console.log(s)
console.log(len)
var fname= s.substring(0,s.indexOf(" "))
console.log(fname)
console.log(s.charAt(3))
console.log(s.charCodeAt(3))
// converting numebrs into string
let count= 10;
let str = "" + count
console.log(str)
let newStr= count + "bananas";
console.log(newStr)

// converting string into number
var n1 = parseInt("42 is the number")
console.log(n1)
var n2 = parseInt("is the new number")
console.log(n2)

let age3=10
if(age3>18|| age<30){
    console.log("person is adult")
}
let x=5;
if(x=="5"){
    console.log("true")
}
let num=16
console.log(num>=18? "Adult": "Minor");
let fruits= ["Apple","bananna","stawberry"]
console.log(fruits[1])
fruits.push("pear")
fruits.unshift("melon")
console.log("printing fruits name")
console.log("Popping element of an array")
for(i=0;i<fruits.length;i++){
    console.log(fruits[i])
}
fruits.pop()
// for of loop
for(let val of fruits){
    console.log(val)
}
// searching in an array
console.log(fruits.indexOf("bananna"))
//for loop
for(i=0;i<fruits.length;i++){
    console.log(fruits[i])
}
// map function change elements in an array
let no =[1,2,3]
let arr= no.map(x=>x*2)
console.log(arr)
console.log(no)
let names=["ali","sara"]
let na=names.map(names=>names.toUpperCase());
console.log(na)

// filter pick elements from array based on some conditioin 
let arr1=[
    {nos:"milli",marks:74},
    {nos:"saarra",marks:42},
   { totalMarks:function(){
        return this.marks
    }
}
];
console.log("total marks",arr1[0].totalMarks)
let pass = arr1.filter(s=>s.marks>=50)
console.log(pass)
// reduce convert array into a single value 
let total = arr1.reduce((acc,s)=> acc+s.marks,0)
console.log(total)
// function without parameters
let fuc= function func1(){
    console.log("Hell0")
}
//fuunction with parameters
function func2(value){
    console.log("Hello",value)
}

func2("milli")
// function with returnning value
let sum= function add(a,b){
    return a+b
}
console.log(sum(5,6))
// in callback functions we pass functions as an arguments
var lname1="kion"
var lName1="chion"
console.log(lname1,lName1)