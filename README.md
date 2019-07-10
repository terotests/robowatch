# Robowatch

## Getting Started

First install the command line utility `rwatch`

```
npm install -g robowatch
```

Then create a file `Robo` with watch instructions, following the [chokidar](https://github.com/paulmillr/chokidar) format.

```

watch src/**.ts {
  shell {
    "cd src && tsc"
  }
}
```
