;; Programming Languages, Homework 5

#lang racket
(provide (all-defined-out)) ;; so we can put tests in a second file

;; definition of structures for MUPL programs - Do NOT change
(struct var  (string) #:transparent)  ;; a variable, e.g., (var "foo")
(struct int  (num)    #:transparent)  ;; a constant number, e.g., (int 17)
(struct add  (e1 e2)  #:transparent)  ;; add two expressions
(struct ifgreater (e1 e2 e3 e4)    #:transparent) ;; if e1 > e2 then e3 else e4
(struct fun  (nameopt formal body) #:transparent) ;; a recursive(?) 1-argument function
(struct call (funexp actual)       #:transparent) ;; function call

(struct mlet (var e body) #:transparent) ;; a local binding (let var = e in body) 
(struct apair (e1 e2)     #:transparent) ;; make a new pair
(struct fst  (e)    #:transparent) ;; get first part of a pair
(struct snd  (e)    #:transparent) ;; get second part of a pair
(struct aunit ()    #:transparent) ;; unit value -- good for ending a list
(struct isaunit (e) #:transparent) ;; evaluate to 1 if e is unit else 0

;; a closure is not in "source" programs but /is/ a MUPL value; it is what functions evaluate to
(struct closure (env fun) #:transparent) 

;; Problem 1
; (a) Write a Racket function racketlist->mupllist that takes a Racket list (presumably of mupl
; values but that will not affect your solution) and produces an analogous mupl list with the same
; elements in the same order.
(define (racketlist->mupllist rl)
  (cond [(null? rl) (aunit)]
        [(null? (cdr rl)) (apair (car rl) (aunit))]
        [#t (apair (car rl) (racketlist->mupllist (cdr rl)))]))

;(b) Write a Racket function mupllist->racketlist that takes a mupl list (presumably of mupl
; values but that will not aect your solution) and produces an analogous Racket list (of mupl
; values) with the same elements in the same order.
(define (mupllist->racketlist ml)
  (cond [(aunit? ml) '()]
        [(apair? ml) (cons (apair-e1 ml) (mupllist->racketlist (apair-e2 ml)))]
        [#t ml]))

;; CHANGE (put your solutions here)

;; Problem 2
;; lookup a variable in an environment
;; Do NOT change this function
(define (envlookup env str)
  (cond [(null? env) (error "unbound variable during evaluation" str)]
        [(equal? (car (car env)) str) (cdr (car env))]
        [#t (envlookup (cdr env) str)]))

;; Do NOT change the two cases given to you.  
;; DO add more cases for other kinds of MUPL expressions.
;; We will test eval-under-env by calling it directly even though
;; "in real life" it would be a helper function of eval-exp.
(define (search-env char env)
  (cond [(null? env) false] 
        [(= char (car (car env))) (car env)] 
        [else (search-env char (cdr env))]))

(define (eval-under-env e env)
  (cond [(var? e) 
         (envlookup env (var-string e))]
        [(int? e) e]
       
        [(add? e) 
         (let ([v1 (eval-under-env (add-e1 e) env)]
               [v2 (eval-under-env (add-e2 e) env)])
           (if (and (int? v1)
                    (int? v2))
               (int (+ (int-num v1) 
                       (int-num v2)))
               (error "MUPL addition applied to non-number")))]
        [(fun? e) (closure env e)]
        [(closure? e) (eval-under-env (closure-fun e) (closure-env e))]
        [(aunit? e) e]
        [(isaunit? e)
         (let ([exp (eval-under-env (isaunit-e e) env)])
           (if (aunit? exp) (int 1) (int 0)))]
        [(ifgreater? e) 
         (let ([v1 (eval-under-env (ifgreater-e1 e) env)]
               [v2 (eval-under-env (ifgreater-e2 e) env)])
           (if (and (int? v1)
                    (int? v2))
               (if (> (int-num v1)
                      (int-num v2))
                   (eval-under-env (ifgreater-e3 e) env)
                   (eval-under-env (ifgreater-e4 e) env))
               (error "MUPL ifgreater applied to non-number")))]
        [(apair? e) (apair
                     (eval-under-env (apair-e1 e) env)
                     (eval-under-env (apair-e2 e) env))]
        [(fst? e)
          (let ([exp (eval-under-env (fst-e e) env)])
                (if (apair? exp) (apair-e1 exp)
                    (error "must be apair")))]
        [(snd? e)
          (let ([exp (eval-under-env (snd-e e) env)])
                (if (apair? exp) (apair-e2 exp)
                    (error "must be apair")))]
        
        [(mlet? e)
         (let* ([value (eval-under-env (mlet-e e) env)]
                [env (cons (cons (mlet-var e) value) env)])
           (eval-under-env (mlet-body e) env))]
        [(call? e)
         (let ([cl (eval-under-env (call-funexp e) env)])
           (if (closure? cl)
               (let* ([fn (closure-fun cl)]
                      [value (eval-under-env (call-actual e) env)]
                      [new-env (cons (cons (fun-formal fn) value) (closure-env cl))])
                 (if (fun-nameopt fn)
                     (let ([env (cons (cons (fun-nameopt fn) cl) new-env)])
                       (eval-under-env (fun-body fn) env))
                     (eval-under-env (fun-body fn) new-env)))
               (error "first params must be a closure")))]
        [#t (error (format "bad MUPL expression: ~v" e))]))

;; Do NOT change
(define (eval-exp e)
  (eval-under-env e null))
        
;; Problem 3

(define (ifaunit e1 e2 e3)
  (ifgreater (isaunit e1) (int 0) e2 e3))

(define (mlet* lstlst e2)
  (if (null? lstlst)
      e2
      (let ([d (car lstlst)])
        (mlet (car d) (cdr d) (mlet* (cdr lstlst) e2)))))

(define (ifeq e1 e2 e3 e4)
  (let ([a (eval-exp e1)]
        [b (eval-exp e2)])
    (ifgreater a b e4
               (ifgreater (add a (int 1)) b e3 e4))))


;; Problem 4

(define mupl-map "CHANGE")

(define mupl-mapAddN 
  (mlet "map" mupl-map
        "CHANGE (notice map is now in MUPL scope)"))

;; Challenge Problem

(struct fun-challenge (nameopt formal body freevars) #:transparent) ;; a recursive(?) 1-argument function

;; We will test this function directly, so it must do
;; as described in the assignment
(define (compute-free-vars e) "CHANGE")

;; Do NOT share code with eval-under-env because that will make
;; auto-grading and peer assessment more difficult, so
;; copy most of your interpreter here and make minor changes
(define (eval-under-env-c e env) "CHANGE")

;; Do NOT change this
(define (eval-exp-c e)
  (eval-under-env-c (compute-free-vars e) null))
