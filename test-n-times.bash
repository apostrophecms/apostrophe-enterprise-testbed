TIMES=$1

n=0
   until [ $n -ge $TIMES ]
   do
      npm run e2e-local
      n=$[$n+1]
   done
