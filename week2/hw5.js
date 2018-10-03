
function Var(string){
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

function ifaunit(pred1, e2, e3){
    if(Aunit.isAunit(pred1) === 0)return e3
    else return e2
}


function Closure(env, fun){
    this.env = env
    this.fun = fun
    this.getClosureEnv = () => this.env
    this.getClosureFun = () => this.fun
}
Closure.isClosure = something => something instanceof Closure

// (struct var  (string) #:transparent)  ;; a variable, e.g., (var "foo")
// (struct int  (num)    #:transparent)  ;; a constant number, e.g., (int 17)
// (struct add  (e1 e2)  #:transparent)  ;; add two expressions
// (struct ifgreater (e1 e2 e3 e4)    #:transparent) ;; if e1 > e2 then e3 else e4
// (struct fun  (nameopt formal body) #:transparent) ;; a recursive(?) 1-argument function
// (struct call (funexp actual)       #:transparent) ;; function call
// (struct mlet (var e body) #:transparent) ;; a local binding (let var = e in body) 
// (struct apair (e1 e2)     #:transparent) ;; make a new pair
// (struct fst  (e)    #:transparent) ;; get first part of a pair
// (struct snd  (e)    #:transparent) ;; get second part of a pair
// (struct aunit ()    #:transparent) ;; unit value -- good for ending a list
// (struct isaunit (e) #:transparent) ;;
// (struct closure (env fun) #:transparet)


// ;; Do NOT change
// (define (eval-exp e)
//   (eval-under-env e null))


function envlookup(env, str){
    if(env.length === 0) throw new Error("Unbound variable during evaluation" + str)
    if(env[0][0] === str) return env[0][1]
    else envlookup(env.slice(1), str)
}

function eval_under_env(e, env){
    console.log(e)
    console.log(Fun.isFun(e))
    if(Var.isVar(e)){
        const getter =  envlookup(env, e.getVarString())
        return getter
    }
    if(Int.isInt(e)){
        return e
    }
    if(Add.isAdd(e)){
        const v1 = eval_under_env(e.getAddE1(), env)
        const v2 = eval_under_env(e.getAddE2(), env)
        if(Int.isInt(v1) && Int.isInt(v2)){
            return new Int(
                v1.getIntNum() + v2.getIntNum()
            )
        }
        else throw new ("MUPL Addition applied to non number")
    }
    if(Ifgreater.isIfGreater(e)){
        // sum of first two compare to last two
        const v1 = eval_under_env(e.getIfgreaterE1(), env)
        const v2 = eval_under_env(e.getIfgreaterE2(), env)
        const v3 = eval_under_env(e.getIfgreaterE3(), env)
        const v4 = eval_under_env(e.getIfgreaterE4(), env)
        if(Int.isInt(v1) && Int.isInt(v2)){
            if(v1.getIntNum() > v2.getIntNum())
                return eval_under_env(e.getIfgreaterE3(), env)
            else 
                return eval_under_env(e.getIfgreaterE4(), env)
        } else {
            throw new Error("MUPL ifgreater applied to non-number")
        }
    }
    
    // fun and closure is simple
    if(Fun.isFun(e)) return new Closure(env, e)
    if(Closure.isClosure(e)) {
        const fun = e.getClosureFun()
        return eval_under_env(fun , e.getClosureEnv())
    }

    if(Mlet.isMlet(e)){
        //assign the exp to the var
        //search env, if found replace it, if not push
        const char = e.getMletVar()
        const found = searchEnv(char, env)
        if(found.length >= 1) found[1] = e.getMletE()
        else env.push([char, e.getMletE()])
        return eval_under_env(e.getMletBody(), env)
    }
    if(Fst.isFst(e)){
        const getSndExp = e.getSnd()
        if(!Apair.isApair(getSndExp)) throw new Error("must be Apair")
        return getSndExp.getApairE1()
    }

    if(Snd.isSnd(e)){
        const getSndExp = e.getSnd()
        if(!Apair.isApair(getSndExp)) throw new Error("must be Apair")
        return getSndExp.getApairE2()
    }

    // TODO: CALL IS NOT YET IMPLEMENTED
    // Call(funexp, actual)
    // Closure(env, fun)
    if(Call.isCall(e)){
        const _closure = eval_under_env(e.getCallFunexp(), env)
        // new Fun is new Closure
        if(Closure.isClosure(_closure)){
            const fn = _closure.getClosureFun()
            const body = fn.getFunBody()
            const v = eval_under_env(e.getCallActual(), env)
            const newEnv = [[fn.getFunFormal(), v]].concat(_closure.getClosureEnv())
            const result = eval_under_env(body, newEnv)
            // // how to execute the function?
            return result
        } else {
            throw new Error("must be a closure")
        }
    }

    throw new Error()
}

function searchEnv(char, env){
    if(env.length === 0) return false
    if(env[0][0] === char) return env[0]
    else searchEnv(char, env.slice(1))
}

function eval_exp(e){
    return eval_under_env(e, [["x","hello"]])
}


function mletStar(listofTempEnv, e2){
    if(listofTempEnv.length <= 0) return e2
    const char = e2.getVarString()
    const found = searchEnv(char, listofTempEnv)
    if(found)
        return new Mlet(found[0], found[1], mletStar(listofTempEnv.slice(1), e2))  
    else 
        return undefined  
}

function ifeq(e1, e2, e3, e4){
    console.log(eval_exp(e1).get)
    if(eval_exp(e1) === eval_exp(e2)) return e3
    else return e4
}




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
   