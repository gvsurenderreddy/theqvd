
set PATH=%PATH%;"c:\Archivos de programa\Resource Hacker\";"c:\Program files\Resource Hacker\";"c:\Archivos de programa\Inno Setup 5";"c:\Program files\Inno Setup 5"
md locale

CD ..\..\ext\QVD-Client
perl Build.PL
call Build
xcopy /s /y blib\locale ..\..\windows\installer\locale
cd ..\..\windows\installer

call exetype NX\nxproxy.exe WINDOWS

call pp -vvv -x -gui ^
-I ..\..\ext\IO-Socket-Forwarder\lib ^
-I ..\..\ext\QVD-Config\lib ^
-I ..\..\ext\QVD-Config-Core\lib ^
-I ..\..\ext\QVD-Client\lib ^
-I ..\..\ext\QVD-HTTP\lib\ ^
-I ..\..\ext\QVD-HTTPC\lib ^
-I ..\..\ext\QVD-Log\lib ^
-I ..\..\ext\QVD-URI\lib ^
-I c:\strawberry\perl\perl\site\lib ^
-l C:\strawberry\perl\site\lib\Alien\wxWidgets\msw_2_8_12_uni_gcc_3_4\lib\wxbase28u_gcc_custom.dll ^
-l C:\strawberry\perl\site\lib\Alien\wxWidgets\msw_2_8_12_uni_gcc_3_4\lib\wxmsw28u_adv_gcc_custom.dll ^
-l C:\strawberry\perl\site\lib\Alien\wxWidgets\msw_2_8_12_uni_gcc_3_4\lib\wxmsw28u_core_gcc_custom.dll ^
-l C:\strawberry\perl\site\lib\auto\Net\SSLeay\libeay32.dll ^
-l C:\strawberry\c\bin\libeay32_.dll ^
-l C:\strawberry\perl\site\lib\auto\Net\SSLeay\ssleay32.dll ^
-l C:\strawberry\c\bin\ssleay32_.dll ^
-l C:\strawberry\c\bin\zlib1_.dll ^
-l C:\strawberry\perl\site\lib\auto\Crypt\OpenSSL\X509\X509.dll ^
-l C:\gettext\bin\intl.dll ^
-l C:\gettext\bin\libasprintf-0.dll.dll ^
-l C:\gettext\bin\libgcc_s_dw2-1.dll ^
-l C:\gettext\bin\libgettextlib-0-18-1.dll ^
-l C:\gettext\bin\libgettextpo-0.dll ^
-l C:\gettext\bin\libgettextsrc-0-18-1.dll ^
-o qvd-client-1.exe ^
..\..\ext\QVD-Client\bin\qvd-gui-client.pl

reshacker -addoverwrite qvd-client-1.exe, qvd-client.exe, pixmaps\qvd.ico,icongroup,WINEXE,
del qvd-client-1.exe

del ..\Output\*.* /q
perl ..\script.pl >..\script.iss
ISCC.exe ..\script.iss