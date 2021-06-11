---
title:  "Factorial"
layout: post
---
\>details here<

{% highlight asm %}

    ; Recitation 8
    ; Author: <Brock Kaess>
    ; Date:   <10/23/20>
    ; Email:  <brock.kaess@colostate.edu>
    ; Class:  CS270
    ; Description: Computes N! (N-factorial) recursively
    ;-------------------------------------------------------------------------------
    ; Begin reserved section: do not change ANYTHING in reserved section!

                    .ORIG x3000
                    BR Main
                    
    ; Parameter and result
    Param           .FILL x0004
    Result          .BLKW 1

    ; Constants
    Stack           .FILL x4000
    One             .FILL #1
    MinusOne        .FILL #-1

    ; End reserved section: do not change ANYTHING in reserved section!
    ;-------------------------------------------------------------------------------

    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
    ;
    ; int Factorial(int N)
    ; Returns N! (must be a recursive function)
    ;
    Factorial       ADD R6, R6, #-1     ; Step 3: allocate space for return value
                    PUSH R7             ; Step 4: push return address
                    PUSH R5             ; Step 5: push previous frame pointer
                    ADD R5, R6, #-1     ; Step 6: setup new frame pointer
                    ADD R6, R6, #-1     ; Step 7: allocate space for local variable
                    
                    ;;;;;;;;;;;;;;;;;;;;; Step 8: body of the function
                    
    Checkpoint1     LDR   R0, R5, #4    ; Load parameter N into a register
                    
                    LD    R1, MinusOne  ; Calculate N - 1
                    ADD   R2, R0, R1    ; R2 will contain N - 1
                    
                    STR R2, R5, #0      ; Store N - 1 in the local variable
                    
                    BRnz  BaseCase      ; Detect base case (N <= 1)
                    
                    ;;;; Start of the recursive call
                    
                    PUSH R2             ; Step 1: push parameter N - 1
                    JSR factorial       ; Step 2: call Factorial(N - 1)
                    POP R2              ; Step 13: retrieve return value into R2
                    ADD R6, R6, #1      ; Step 14: remove parameter from stack
                    
                    LDR   R0, R5, #4    ; Multiply N * Factorial(N - 1)
                    .ZERO R3            ; R3 will contain the product
    MultiplyLoop    ADD   R3, R3, R2    ; Notice that by this point, R0 > 1
                    ADD   R0, R0, #-1   ;
                    BRp   MultiplyLoop  ;
                    
                    STR R3, R5, #3      ; Make return value = N * Factorial(N - 1)
                    
                    BR    Finish
                    
                    ;;;; End of the recursive call
                    
                    ;;;; Start of the base case
                    
    BaseCase        LD    R0, One       ; Make return value = 1
                    STR   R0, R5, #3    ;
                    
                    ;;;; End of the base case
                    
                    ;;;;;;;;;;;;;;;;;;;;; End of the body of the function
                    
    Finish          ADD R6, R6, #1      ; Step 9: remove local variable from stack
                    POP R5              ; Step 10: restore previous frame pointer
                    POP R7             ; Step 11: restore return address
    Checkpoint2     RET                 ; Step 12: return to calling subroutine

    ;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
    ;
    ; Entry point
    ; Calls Factorial(Param) and stores the return value in Result
    ;
    Main            LD    R6, Stack     ; Initialize stack pointer
                    LD    R5, Stack     ; Initialize frame pointer
                    
                    LD    R0, Param     ; Load parameter into a register
                    
                    PUSH R0             ; Step 1: push parameter
                    JSR Factorial       ; Step 2: call Factorial(Param)
                    POP R0              ; Step 13: retrieve return value
                    ADD R6, R6, #1      ; Step 14: remove parameter from stack
                    
                    ST R0, Result      ; Store return value in Result
                    
    TheEnd          HALT
                    
                .END

{% endhighlight %}