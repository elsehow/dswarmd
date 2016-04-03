# dswarmd 

device swarm daemon

## installation

```
npm i electron-prebuilt -g
npm i dswarmd -g 
```

## example

first generate some ed25519 keys:

```
npm run generate-keys
```

you can use these keys for a [swarmlog](https://github.com/substack/swarmlog)

now, you can you start your device publishing its IP addresses to this swarm

```
dswarmd -k keys.json -n "laptop"
```

where `-n` is the name of your device

do this on as many devices as you want - just use the same keys.json for every device in your swarm. (and be sure to use unique names for all your devices!)

# license
BSD
