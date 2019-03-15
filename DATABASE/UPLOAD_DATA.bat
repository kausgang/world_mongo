

for /f "usebackq delims=|" %%f in (`dir /b .\DB`) do (

call "C:\Program Files\MongoDB\Server\3.2\bin\mongoimport" -h ds155634.mlab.com:55634 -d worlddb -c timeline -u sadmin -p Kolkata#1 --file .\DB\%%f 

)


