# Robowatch

Configurable filesystem observer and script runner.

- Listens to changes to the filesystem and runs scripts based on events defined in `Robo` -file
- Multiple files and directory trees can be followed
- Ignore pattern `!something`
- Events can be delayed using `bounce`
- Configuration changes are loaded dynamically
- You can have comments like `; here is explanation what this should do`

You can use it to create local build pipelines, automatic test runs etc.

## Getting Started

First install the command line utility `rwatch`

```
npm install -g robowatch
```

Then create a file `Robo` with watch instructions, following the [chokidar](https://github.com/paulmillr/chokidar) format.

```

watch src/**.ts {
  shell {
    debounce 3 "waiting 3 seconds"
    "cd src && tsc"
  }
}
```

## Comments

```
; here is a comment
watch somefile {

}
```

## Running commands in the shell

Pure Shell commands are quoted like `'echo "Hello World"'`

Each quoted command is run as separate exec under selected shell.

```
watch somefile {
  shell {
    ; single quotes
    'ls -al'

    ; double quotes
    "ls -al"

    ; back-trick
    `cd dir;
      echo $(dirname "$FILE");
      echo $FILE;
    `

  }
}
```

## Select the shell

The shell command can have `use "/bin/bash"` to select the running shell

```
watch (
    !./**/node_modules/**
    ./**/package.json
  ) {
  shell use "/bin/bash" {
    ; display which shell we are using
    'echo $0'
  }
}
```

## debounce

Debounce will some seconds before starting. If new events arrive the
startup is delayed N seconds more.

```
 debounce 3 "waiting 3 seconds"
```

Example

```
watch *.css {
  shell use "/bin/bash" {
    debounce 5 "waiting before "
```

## \$FILE

Show the changed filename

```
watch src/**.ts {
  shell {
    `
      echo $(dirname "$FILE");
      echo $FILE;
    `
  }
}
```

## Multiple files

Multiple files can be observer

```
watch (
    file1
    file2
    robowatch/src/**/*.ts
  ) {

}
```

## Ignoring files

Do not follow changes in node_modules

```
watch (
    ./**.ts
    !./**/node_modules/**
  ) {

}
```

# Examples

## Audit package.json files

Example uses MacOS `osascript` to display messages to user

```
watch (
    !./**/node_modules/**
    ./**/package.json
  ) {
  shell use "/bin/bash" {
    debounce 5 "auditing package.json"
    `
      DIR=$(dirname "$FILE");
      echo $DIR;
      cd $DIR;
      RVOF=$(npm audit);
      retVal=$?
      if [ $retVal -ne 0 ]; then
        MSG='say "You loser! npm audit for ';
        MSG+="$FILE";
        MSG+=' failed"';
        echo "$MSG" | osascript;
      else
        MSG='display notification "✅ npm audit for ';
        MSG+="$FILE";
        MSG+=' was success!"';
        echo "$MSG" | osascript;
      fi;
    `
  }
}
```
