function test1() {
  test2();
  console.log("test passé !");
}

function test2() {
  return test3();
}

function test3() {
  var a = 1;
}
