# Robowatch

Configurable filesystem observer.

- Listens to changes to the filesystem
- Runs shell commands based on the changed files
- Can reload it's own configuration dynamically

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

## debounce

Wait some seconds before starting

```
 debounce 3 "waiting 3 seconds"
```

## \$FILE

Show the changed filename

```
watch src/**.ts {
  shell {
    'echo "$FILE"'
  }
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
