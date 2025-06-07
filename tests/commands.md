./fxp val -f tests/inputs/input1.xml
./fxp val -f tests/inputs/input1.xml -b
./fxp val -f tests/inputs/input1.xml --config tests/config/config-unpaired.json
./fxp val -f tests/inputs/invalid.xml
./fxp val -f tests/inputs/input*.xml
./fxp x2j -f tests/inputs/input1.xml
./fxp x2j -f tests/inputs/input1.xml -p
./fxp x2j -f tests/inputs/input1.xml -v
./fxp x2j -f tests/inputs/input1.xml -s script,style
./fxp x2j -f tests/inputs/input1.xml --order
./fxp x2j -f tests/inputs/input1.xml -o tests/output/output.json
ls tests/inputs/output.json
#./fxp x2j -f tests/inputs/input*.xml -o tests/output/output*.json
./fxp x2j -f tests/inputs/input*.xml -o tests/output/output1.json tests/output/output2.json
cat tests/inputs/input1.xml | ./fxp x2j -f -
./fxp x2j -f tests/inputs/input1.xml --config tests/config/config-stopnodes.json
./fxp x2j -f tests/inputs/invalid.xml
./fxp x2j -f tests/inputs/input1.xml -o tests/inputs/output.xml
./fxp j2x -f tests/inputs/input1.json
./fxp j2x -f tests/inputs/input1.json -p
./fxp j2x -f tests/inputs/input1.json -e
./fxp j2x -f tests/inputs/input1.json -s script,style
./fxp j2x -f tests/inputs/input1.json --order
./fxp j2x -f tests/inputs/input1.json -o tests/inputs/output.xml
ls tests/inputs/output.xml
./fxp val -f tests/inputs/input1.xml
cat tests/inputs/input1.json | ./fxp j2x -f -
./fxp j2x -f tests/inputs/input1.json --config tests/config/config-array.json
./fxp j2x -f tests/inputs/invalid.json
./fxp j2x -f tests/inputs/input1.json -o tests/inputs/output.json
./fxp invalid
./fxp x2j -f tests/inputs/missing.xml
./fxp --version
./fxp val -f invalid.xml --lang hi
./fxp invalid --lang-file tests/inputs/custom-lang.json
echo $?

./fxp val -f tests/inputs/input1.xml tests/inputs/invalid.xml