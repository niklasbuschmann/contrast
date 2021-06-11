---
title:  "Title"
layout: post
---
\>details here<

Header File:
{% highlight c %}

    #ifndef __FIELD_H__
    #define __FIELD_H__

    /*
    * field.h - simple field manipulation functions to get students working
    *           with masking. This will be used in the simulator to extract
    *           information when executing an LC3 instruction. It may also be
    *           used in the assembler to "create" the 16 bit LC3 instructions.
    *           If an assignment involving floating point manipulation (e.g.
    *           16 bit floating point addition), this file can be used to
    *           provide support routines for extracting/setting the sign,
    *           exponent, and mantissa fields.
    *
    * "Copyright (c) 2013 by Fritz Sieker."
    *
    * Permission to use, copy, modify, and distribute this software and its
    * documentation for any purpose, without fee, and without written
    * agreement is hereby granted, provided that the above copyright notice
    * and the following two paragraphs appear in all copies of this software,
    * that the files COPYING and NO_WARRANTY are included verbatim with
    * any distribution, and that the contents of the file README are included
    * verbatim as part of a file named README with any distribution.
    *
    * IN NO EVENT SHALL THE AUTHOR BE LIABLE TO ANY PARTY FOR DIRECT,
    * INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT
    * OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF THE AUTHOR
    * HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    *
    * THE AUTHOR SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT
    * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
    * A PARTICULAR PURPOSE.  THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS IS"
    * BASIS, AND THE AUTHOR NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT,
    * UPDATES, ENHANCEMENTS, OR MODIFICATIONS."
    */

    /** @file field.h
     *  @brief Defines interface of field.c functions (do not modify)
     *  @details This file defines the interface to a C file field.c that
     *  you will complete.  You will learn how to
     *  use the C language operators for binary <b>and</b> (<b>&amp;</b>),
     *  binary <b>or</b> (<b>|</b>), and binary <b>not</b> (<b>~</b>). You will also use the
     *  C language <b>bit shift</b> operators (<b>&lt;&lt;</b> and <b>&gt;&gt;</b>).
     *  @author Fritz Sieker
     */
    #include <stdbool.h>
    /** Get the specified bit from a value.
     *  @param value the source value or bit pattern
     *  @param position the bit position to get (0..31)
     *  @return 1 when the bit is set, and 0 otherwise.
     */
    int getBit (int value, int position);

    /** Set the specified bit in a value (make it equal to 1).
     *  @param value the source value or bit pattern
     *  @param position the bit position to be set (0..31)
     *  @return An integer value that is the original value with the specified bit
     *  set.
     */
    int setBit (int value, int position);

    /** Clear the specified bit in a value (make it equal to 0).
     *  @param value the source value or bit pattern
     *  @param position the bit position to be set (0..31)
     *  @return An integer value that is the original value with the specified bit
     *  cleared.
     */
    int clearBit (int value, int position);

    /** Extract the field (possibly signed) between bits hi and lo (inclusive).
     *  @param value  the source value or bit pattern
     *  @param hi the bit position of one end of the field
     *  @param lo the bit position of the other end of the field
     *  @param isSigned false means the field is unsigned, true means the field is signed
     *  @return The value of the field.  Sanity check example:
     *  if the field is three bits wide and unsigned, the result
     *  will be a value between 0 and 7, regardless of the actual position of the
     *  bits in value. If the value is signed, the result will be between -4 and 3.
     *  Furthermore, if the value is signed, it will be negative <b>only</b> if
     *  the left most bit of the field is 1. In this case, the field must be
     *  sign extended (i.e. make all bits to the left 1).
     */
    int getField (int value, int hi, int lo, bool isSigned);

    #endif

{% endhighlight %}

C File:
{% highlight c %}

    #include "field.h"

    /** @file field.c
     *  @brief You will modify this file and implement five functions
     *  @details Your implementation of the functions defined in field.h.
     *  You may add other function if you find it helpful. 
     * <p>
     * @author <b>Your name</b> goes here
     */

    /** @todo Implement in field.c based on documentation contained in field.h */
    int getBit (int value, int position){
        return (value >> position) & 1;
    }

    /** @todo Implement in field.c based on documentation contained in field.h */
    int setBit (int value, int position) {
        return value |  (1 << position);
    }

    /** @todo Implement in field.c based on documentation contained in field.h */
    int clearBit (int value, int position) {
        return value & ~(1 << position);
    }

    /** @todo Implement in field.c based on documentation contained in field.h */
    int getField (int value, int hi, int lo, bool isSigned) {
        int mask = 0;
        for(int i = lo; i <= hi; i++){
        mask = (mask << i) + 1;
        }
        value = value & mask;
        if(isSigned){
        value = value ^ mask;
        return ~value;
        }
        return value;
    }

{% endhighlight %}

Test Functionality File:
{% highlight c %}

  /*
  * testField.c - simple driver to test methods of field.h.
  *
  * "Copyright (c) 2013 by Fritz Sieker."
  *
  * Permission to use, copy, modify, and distribute this software and its
  * documentation for any purpose, without fee, and without written
  * agreement is hereby granted, provided that the above copyright notice
  * and the following two paragraphs appear in all copies of this software.
  *
  * IN NO EVENT SHALL THE AUTHOR BE LIABLE TO ANY PARTY FOR DIRECT,
  * INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT
  * OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF THE AUTHOR
  * HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  *
  * THE AUTHOR SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT
  * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
  * A PARTICULAR PURPOSE.  THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS IS"
  * BASIS, AND THE AUTHOR NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT,
  * UPDATES, ENHANCEMENTS, OR MODIFICATIONS."
  */

  #include <stdio.h>
  #include <stdlib.h>
  #include <string.h>
  #include "field.h"

  /** @mainpage CS270 Recitation R2 - Bit Fields in C
   *  \htmlinclude "BitFields.html"
   */

  /** @file: testField.c
   *  @brief Driver to test functions of field.c (do not modify)
   *
   * @details This is a driver program to test the functions
   * defined in field.h and implemented in field.c. The program takes one
   * or more command line parameters and calls one of the methods, then
   * prints the results. To see how to use the program, execute
   * <code>testField</code> in a terminal window. This will print a usage
   * statement defining how to run the program. The first parameter of the
   * program is always a key defining which function to run. The
   * options are:
   * <ul>
   * <li><b>bin</b> print the next parameter in decimal, hex and binary</li>
   * <li><b>getBit</b> gets the specified bit from a binary value (2 more parameters)</li>
   * <li><b>setBit</b> sets the specified bit in a binary value to 1 (2 more parameters)</li>
   * <li><b>clearBit</b> sets the specified bit in a binary value to 0 (2 more parameters)</li>
   * <li><b>getField</b> get a field from a value (4 more parameters)</li>
   * </ul>
   * <p>
   * A sample execution might be: <code>testField getField 0xABCD 9 4 0</code>
   * <p>
   * which prints <pre><code>getField: get bits 9:4 from 0xABCD (sign 0) = 0x3C</code></pre>
   * <p>
   * All values may be entered as signed decimal numbers or as hex values
   * by beginning it with <code>0x</code>.
   * <p>
   * @author Fritz Sieker
   */

  /** Print the binary representation of a value starting at the specified
   * bit position. A separator is printed every 4 bits for easy reading.
   * @param value the value to be printed
   * @param msb the bit position to begin printing (31 to 0)
   */
  void printBinaryMSB (int value, int msb) {
    while (msb >= 0) {
      putchar(((value & (1 << msb)) ? '1' : '0'));
      if (msb && ((msb & 0x3) == 0))
        putchar('-');
      msb--;
    }
  }

  /** Print a 32 bit binary representation of a value.
   * @param value the value to be printed
   */
  void printBinary (int value) {
    printBinaryMSB(value, 31);
  }

  /** Print a usage statement, then exit the program returning a non zero
   * value, the Linux convention indicating an error
   */
  static void usage() {
    puts("Usage: testField bin value");
    puts("       testField getBit value position");
    puts("       testField setBit value position");
    puts("       testField clearBit value position");
    puts("       testField getField value hi lo isSigned");
    exit(1);
  }

  /** print the value in decimal, hex and binary.
   * @param result the value to be printed.
   */
  static void printResult (int result) {
    printf("dec: %d hex: 0x%X bin: ", result, result);
    printBinary(result);
    printf("\n");
  }

  /** Entry point of the program
   * @param argc count of arguments, will always be at least 1
   * @param argv array of parameters to program argv[0] is the name of
   * the program, so additional parameters will begin at index 1.
   * @return 0 the Linux convention for success.
   */
  int main (int argc, char* argv[]) {
    char* junk;
    int   value, result, position, hi, lo;
    bool isSigned;

    if (argc < 3)
      usage();
    
    char* op = argv[1];

    if ((strcmp(op, "bin") == 0) && (argc == 3)) {
      printResult((int) strtol(argv[2], &junk, 0));
    }

    else if ((strcmp(op, "getBit") == 0) && (argc == 4)) {
      value    = (int) strtol(argv[2], &junk, 0);
      position = (int) strtol(argv[3], &junk, 0);
      result   = getBit(value, position);
      printf("getBit %d from 0x%x = %d\n", position, value, result);
    }

    else if ((strcmp(op, "setBit") == 0) && (argc == 4)) {
      value    = (int) strtol(argv[2], &junk, 0);
      position = (int) strtol(argv[3], &junk, 0);
      result   = setBit(value, position);
      printf("setBit %d in 0x%x = 0x%x\n", position, value, result);
    }

    else if ((strcmp(op, "clearBit") == 0) && (argc == 4)) {
      value    = (int) strtol(argv[2], &junk, 0);
      position = (int) strtol(argv[3], &junk, 0);
      result   = clearBit(value, position);
      printf("clearBit %d in 0x%x = 0x%x\n", position, value, result);
    }

    else if ((strcmp(op, "getField") == 0) && (argc == 6)) {
      value    = (int) strtol(argv[2], &junk, 0);
      hi       = (int) strtol(argv[3], &junk, 0);
      lo       = (int) strtol(argv[4], &junk, 0);
      isSigned = (bool) strtol(argv[5], &junk, 0);
      result   = getField(value, hi, lo, isSigned);
      printf("getField: get bits %d:%d from 0x%X (signed %d) = 0x%X\n", hi, lo, value, isSigned, result);
    }

    else
      usage();
    
    return 0;
  }

{% endhighlight %}

Make File:
{% highlight make %}

    # Makefile template for CS 270

    # List of files
    C_SRCS		= field.c testField.c
    C_OBJS		= field.o testField.o
    C_HEADERS	= field.h

    OBJS		= ${C_OBJS} 
    EXE	        = testField

    # Compiler and loader commands and flags
    CC		    = gcc
    CC_FLAGS	= -std=c11 -g -Wall -c
    LD_FLAGS	= -std=c11 -g -Wall

    # Target is the executable
    testField: $(OBJS)	
        @echo "Linking all object modules ..."
        $(CC) $(LD_FLAGS) $(OBJS) -o $(EXE)
        @echo ""

    # Recompile C objects if headers change
    ${C_OBJS}:      ${C_HEADERS}

    # Compile .c files to .o files
    .c.o:
        @echo "Compiling each C source file separately ..."
        $(CC) $(CC_FLAGS) $<
        @echo ""

    # Clean up the directory
    clean:
        @echo "Cleaning up project directory ..."
        rm -f *.o *~ $(EXE)
        @echo ""

{% endhighlight %}