# Twitter Alarm

Using the [ntwitter](https://github.com/AvianFlu/ntwitter) streaming twitter client to listen for tweets matching keywords and play a notification sound when it comes in.

## Install

```bash
git clone https://github.com/miguelmota/node-twitter-alarm
cd node-twitter-alarm
npm install
```

Set up your [twitter](https://apps.twitter.com/) credentials in `config.json`

## Usage

```bash
node index.js "burritos" "tacos"
```

```bash
Listening for tweets matching: burritos, tacos

> @_moogs : Need more burritos in my life Sat May 10 2014 18:16:37 GMT-0700
```

## Notes

On Debian/Ubuntu, the ALSA backend is selected by default, so be sure to have the `alsa.h` header file in place:

```bash
sudo apt-get install libasound2-dev
```

## Global install

```bash
npm install twitter-alarm -g
```

```bash
cp /usr/local/lib/node_modules/twitter-alarm/config.json ~/.twitter-alarm/config.json
```

```bash
twitter-alarm "burritos" "tacos"
```

# License

Released under the MIT License.
