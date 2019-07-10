# Project robowatch

Sample usage

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
