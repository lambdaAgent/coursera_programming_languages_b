tring){
    this.string = string
    this.getVarString = () => this.string
}
Var.isVar = (something) => something instanceof Var

function Int(num){
    this.num = num
    this.getIntNum = () => this.num
}
Int.isInt = (something) => something instanceof Int

function Add(e1, e2){
    this.e1 = e1
    this.e2 = e2
    this.getAddE1 = () => this.e1
    this.getAddE2 = () => this.e2
}
Add.isAdd = (something) => something instanceof Add

function Ifgreater(e1,e2,e3,e4){
    this.e1 = e1
    this.e2 = e2
    this.e3 = e3
    this.e4 =  e4
    this.getIfgreaterE1 = () => this.e1
    this.getIfgreaterE2 = () => this.e2
    this.getIfgreaterE3 = () => this.e3
    this.getIfgreaterE4 = () => this.e4
}
Ifgreater.isIfGreater = (something) => something instanceof Ifgreater

function Fun(nameopt, formal, body){
    this.nameopt = nameopt
    this.formal = formal
    this.body = body
    this.getFunNameOpt = () => this.nameopt
    this.getFunFormal = () => this.formal
    this.getFunBody = () => this.body
}
Fun.isFun = something => something instanceof Fun

function Call(funexp, actual){
    this.funexp = funexp
    this.actual = actual
    this.getCallFunexp = () => this.funexp
    this.getCallActual = () => this.actual
}
Call.isCall = something => something instanceof Call

function Mlet(Var, e, body){
    this.Var = Var
    this.e = e
    this.body = body
    this.getMletVar = () => this.Var
    this.getMletE = () => this.e
    this.getMletBody = () => this.body
}
Mlet.isMlet = something => something instanceof Mlet

function Apair(e1, e2){
    this.e1= e1
    this.e2 = e2
    this.getApairE1 = () => this.e1
    this.getApairE2 = () => this.e2
}
Apair.isApair = something => something instanceof Apair

function Fst(e){
    this.e = e
    this.getE = () => this.e
}
Fst.isFst = something => something instanceof Fst

function Snd(e){
    this.e = e
    this.getSnd = () => this.e
}
Snd.isSnd = something => something instanceof Snd

function Aunit(){}
Aunit.isAunit = something => something instanceof Aunit ? new Unit(1) : new Unit(0)

function is


// TEST

// (eval-exp (ifgreater (int 3) (int 4) (int 3) (int 2)))
// const test1 = eval_exp(new Var("x"))
// console.log(test1)
// const test2 = eval_exp(new Add(new Int(1), new Int(30)))
// console.log(test2)
// const test3 = eval_exp(
//     new Ifgreater(new Int(3), new Int(4), new Int(3), new Int(2))
// )
// console.log(test3)
// const test4 = eval_exp(
//     new Mlet("x", new Int(1),
//         new Add( new Int(5), new Var("x"))
//     )
// )
// console.log(test4)

// ;;snd test
// (check-equal? (eval-exp (snd (apair (int 1) (int 2)))) (int 2) "snd test")
// const sndTest = eval_exp(new Snd(new Apair(new Int(1), new Int(2))))
// console.log(sndTest)

// ;; isaunit test
// (check-equal? (eval-exp (isaunit (closure '() (fun #f "x" (aunit))))) (int 0) "isaunit test")

// ;; ifaunit test
// (check-equal? (eval-exp (ifaunit (int 1) (int 2) (int 3))) (int 3) "ifaunit test")
// const ifaunitTest = eval_exp(new ifaunit(new Int(1), new Int(2), new Int(3)))
// console.log(ifaunitTest)


// const test10 = eval_exp(new Ifgreater(new Int(3), new Int(4), new Int(3), new Int(2)  ))
// console.log(test10)


// ;; mlet* test
//    (check-equal? (eval-exp (mlet* (list (cons "x" (int 10))) (var "x"))) (int 10) "mlet* test")
// const mletStarTest = eval_exp(mletStar(
//     [["x", new Int(10)]],
//     new Var("x")
// ))
// console.log(mletStarTest)
   
//    ;; ifeq test
//    (check-equal? (eval-exp (ifeq (int 1) (int 2) (int 3) (int 4))) (int 4) "ifeq test")
// let ifeqTest = eval_exp(ifeq(new Int(1), new Int(2), new Int(3), new Int(4)))
// console.log(ifeqTest)
//     ifeqTest = eval_exp(ifeq(new Int(2), new Int(2), new Int(3), new Int(5)))
// console.log(ifeqTest)
//     ifeqTest = eval_exp(ifeq(new Int(1), new Int(2), new Int(3), new Int(4)))
//     ifeqTest = eval_exp(ifeq(new Int(1), new Int(2), new Int(3), new Int(4)))
// console.log(ifeqTest)

// ;; call test
// (check-equal? (eval-exp (call (fun #f "x" (int 7)) (int 1))) (int 7) "Should return 7")
// (check-equal? (eval-exp (call (fun #f "x" (add (var "x") (int 7))) (int 1))) (int 8) "Should return 8")
// (check-equal? (eval-exp (call (closure '() (fun #f "x" (add (var "x") (int 7)))) (int 1))) (int 8) "call test")

// let callTest = eval_exp(new Call(
//     new Fun(false, "x", new Int(7)),
//     new Int(1)
// ))
// console.log(callTest)
// // callTest = eval_exp(new Call(new Int(10)))
// // console.log(callTest)
// callTest = eval_exp(new Call(
//     new Fun(false, "x", new Add(new Var("x"), new Int(7))),
//     new Int(1)
// ))
// console.log(callTest)// Int 8
callTest = eval_exp(new Call(
    new Closure([], 
        new Fun(false, "x", new Add(new Var("x"), new Int(7)))
    ),
    new Int(1)
))
console.log(callTest)

// fun x(){ get(x) + 7 }


//    ;; mupl-map test
//    (check-equal? (eval-exp (call (call mupl-map (fun #f "x" (add (var "x") (int 7)))) (apair (int 1) (aunit)))) 
//                  (apair (int 8) (aunit)) "mupl-map test")
   