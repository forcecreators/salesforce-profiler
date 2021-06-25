@echo off

call :output "Running Enviornment Setup"

if "%~1" NEQ "finish" goto :checknvm
if "%~1"=="finish" goto :finish

goto :exit

:checknvm
call :output "Looking for nvm"
nvm version
if %errorlevel% == 0 goto :install else goto :nonvm

:nonvm
call :error "Unable to run the nvm command. Is nvm installed?"
call :output "Its likely that nvm is not installed. You can install nvm here:"
call :output "https://github.com/coreybutler/nvm-windows/releases/latest"
goto :done

:install
call :output "Getting latest version of node.js"
nvm install latest
call :output "Turning on nvm"
nvm on
call :output "Building application and dependencies.  This may take a few moments for fresh builds."
start /wait setup.bat finish
if %errorlevel% == 0 goto :completed
goto :failed

:finish
call :output "Installing yarn"
call npm install yarn -g
if %errorlevel% NEQ 0 exit %errorlevel%
call :output "Initializing workspace and dependencies."
call yarn
exit %errorlevel%

:output 
echo [7m INFO: [0m %~1
EXIT /B 0

:error 
echo [101;93m ERROR: [0m %~1
EXIT /B 0

:success 
echo [102;30m SUCCESS: [0m %~1
EXIT /B 0

:completed
call :success "Build completed successfully"
goto :done

:failed
call :error "Build Failed"
goto :done

:done
echo.