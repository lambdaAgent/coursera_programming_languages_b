
#lang racket

(provide (all-defined-out)) ;; so we can put tests in a second file

(define ones (lambda () (cons 1 ones)))
(define a 2)
  

;; put your code below
;; question 1
(define (sequence low high stride)
  (if (> low high)
      null
      (cons low (sequence (+ low stride) high stride))))

;; question 2
(define (string-append-map xs str)
  (map (lambda (x) (string-append x str)) xs))

;; question 3
(define (list-nth-mod xs n)
  (cond [(< n 0) (error "list-nth-mod: negative number")]
        [(null? n) (error "list-nth-mod: empty list")]
        [else (list-ref xs (remainder n (length xs)))]))

; question 4
; stream-for-n-steps
(define (stream-for-n-steps stream step)
  (if (= step 0)
      null
      (cons (car (stream))
            (stream-for-n-steps (cdr (stream)) (- step 1)))))

; question 5
; funny-number-stream
(define (funny-number-stream)
  (define (innerFun x)
    (if (= 0 (remainder x 5))
        (cons (* -1 x) (lambda() (innerFun (+ x 1))))
        (cons x (lambda() (innerFun (+ x 1))))))
  (innerFun 1))

;question 6
; dag then dog
(define dan-then-dog
  (lambda ()
    (define (innerFun x)
      (if(= x 1)
         (cons "dan.jpg" (lambda () (innerFun 2)))
         (cons "dog.jpg" (lambda () (innerFun 1)))))
    (innerFun 1)))

; question 7
; stream-add-zero test
(define (stream-add-zero th)
  (lambda ()
    (cons (cons 0 (car (th)))
          (stream-add-zero (cdr (th))))))    

; question 8
(define (cycle-lists xs ys)
  (define (fun n)
    (cons (cons (list-nth-mod xs n)
                (list-nth-mod ys n))
          (lambda() (fun (+ n 1)))))
  (lambda() (fun 0)))

; question 9
(define (vector-assoc v vec)
  (define len (vector-length vec))
  (define (fun current)
    (cond [(= current len) #f]
          [(pair? (vector-ref vec current))
               (if (equal? (car (vector-ref vec current)) v)
                   (vector-ref vec current)
                   (fun (+ current 1)))]
          [else (fun (+ current 1))]))
  (fun 0))

;question-10
(define (cached-assoc vec n)
    (define cached (make-vector n))
    ; main-function is higher-order-function
    (define (main-function xs)
      (lambda (x)
        (define found-in-cache (vector-assoc x cached))
        (if found-in-cache
            found-in-cache
            (let ([found-in-list (vector-assoc x xs)])
             (vector-set! cached 0 found-in-list)
             found-in-list))))
  ; return partially applied main-function
  (main-function vec))

;question 11
(define-syntax while-less
  (syntax-rules (do)
    [(while-less e1 do e2)
      (let ([x e1])
        (define (loop fn)
          (define x2 fn)
          (if (< x2 x)
              (loop e2)
              #t))
        (loop e2))
     ]))
  