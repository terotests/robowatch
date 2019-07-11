# Robowatch

Configurable filesystem observer. NOTE: this is just the first version, more feaures will come soon.

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
