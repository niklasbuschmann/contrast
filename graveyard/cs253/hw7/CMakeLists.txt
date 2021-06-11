cmake_minimum_required(VERSION 3.11)
project(hw7)
 
# Are we in the wrong directory?
if(CMAKE_SOURCE_DIR MATCHES "[Hh][Ww]([0-9])$")
   if(PROJECT_NAME MATCHES "[^${CMAKE_MATCH_1}]$")
      message(FATAL_ERROR "Building ${PROJECT_NAME} in ${CMAKE_SOURCE_DIR}")
   endif()
endif()
 
# Using -Wall is required:
add_compile_options(-Wall)
 
# These compile flags are highly recommended, but not required:
add_compile_options(-Wextra -Wpedantic)
 
# Optional super-strict mode:
add_compile_options(-fmessage-length=80 -fno-diagnostics-show-option
    -fstack-protector-all -g -O3 -std=c++17 -Walloc-zero -Walloca
    -Wctor-dtor-privacy -Wduplicated-cond -Wduplicated-branches
    -Werror -Wextra-semi -Wfatal-errors -Winit-self -Wlogical-op
    -Wold-style-cast -Wshadow -Wunused-const-variable=1
    -Wzero-as-null-pointer-constant)
 
# add_compile_options must be BEFORE add_executable.
 
# Create the executable from the source file main.cc:
add_library(${PROJECT_NAME} Words.cc)
add_executable(test test.cc)
target_link_libraries(test ${PROJECT_NAME})
 
# Create a tar file every time:
add_custom_target(${PROJECT_NAME}.tar ALL COMMAND
    tar -cf ${PROJECT_NAME}.tar *.cc *.h CMakeLists.txt)