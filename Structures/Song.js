const { MessageEmbed } = require('discord.js');
const { createAudioResource } = require('@discordjs/voice');
const YTSEARCH = require('yt-search');
const YTDL_EXEC = require('youtube-dl-exec').raw;

const noop = () => {};

const getSong = async (query, methods, options) => {
	const searchResults = await YTSEARCH(query);
	const video = 
	(searchResults.videos.length > 1) ? searchResults.videos[0] : null;

	const wrappedMethods = {
		onStart() {
			wrappedMethods.onStart = noop;
			methods.onStart();
		},
		onFinish() {
			wrappedMethods.onFinish = noop;
			methods.onFinish();
		},
		onError(error) {
			wrappedMethods.onError = noop;
			methods.onError(error);
		},
	};

	return (video) ?
		new Song ({
			title: video.title,
			url: video.url,
			thumbnail: video.thumbnail,
			...wrappedMethods
		})
	 : null;
}

const createSongsFromPlaylist = (playlist, methods) => {
	let songQueue = [];

	const wrappedMethods = {
		onStart() {
			wrappedMethods.onStart = noop;
			methods.onStart();
		},
		onFinish() {
			wrappedMethods.onFinish = noop;
			methods.onFinish();
		},
		onError(error) {
			wrappedMethods.onError = noop;
			methods.onError(error);
		},
	};

	playlist.forEach(obj => {
		songQueue.push(
			new Song({ 
				title: obj.title, 
				url: obj.url, 
				thumbnail: obj.thumbnail,
				...wrappedMethods
			})
		);
	});

	return songQueue;
}

const displaySongAsEmbed = (songData, msg) => {
	return new MessageEmbed()
	.setColor("RANDOM")
	.setTitle("Song link")
	.setURL(`${songData.url}`)
	// .setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
	// .setDescription("Click above title to visit the song's YouTube link")
	// .setThumbnail("")
	.addFields(
		// { name: 'Regular field title', value: 'Some value here' },
		// { name: '\u200B', value: '\u200B' },
		{ name: `Now Playing  🎵`, value: `${songData.title}`, inline: true },
		{ name: `Requested by`, value: `${msg.author}`, inline: true },
	)
	// .addField('Inline field title', 'Some value here', true)
	.setImage(`${songData.thumbnail}`)
	// .setTimestamp()
	// .setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');
}

class Song {
	constructor(options) {
		this.title = options.title;
		this.url = options.url;
		this.thumbnail = options.thumbnail;

		this.onStart = options.onStart;
		this.onFinish = options.onFinish;
		this.onError = options.onError;
	}	

	async createAudioResourceCustom() {
		const stream = YTDL_EXEC(this.url, {
			o: '-',
			q: '',
			f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
			r: '100K',
		}, 
		{ stdio: ['ignore', 'pipe', 'ignore'] }
		);
		
		return createAudioResource(stream.stdout, { metadata: this });
	}
}

module.exports = { Song, getSong, createSongsFromPlaylist, displaySongAsEmbed };