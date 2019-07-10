# Project robowatch

Install

```
npm install -g robowatch
```

Then

1.  Create file `Robo`
2.  run `rwatch`

# Robo config file

```
watch robowatch/README.md {
  shell {
    'cd robowatch && git add README.md && git commit -m "README update" && git push'
    'echo "README.md was edited!!!"'
  }
}

watch src/**.ts {
  shell {
    "cd src && tsc"
  }
}
```
