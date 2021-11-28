const { 
	AudioPlayerStatus,
	entersState,
	VoiceConnectionDisconnectReason,
	VoiceConnectionStatus,
} = require('@discordjs/voice');
const { promisify } = require('node:util');

const wait = promisify(setTimeout);

class MusicSubscription {
	/**
	 * @param { connection: VoiceConnection, player: AudioPlayer}  options 
	 */
	constructor(options) {
		this.connection = options.connection;
		this.player = options.player;
		this.queue = [];
		this.queueIndex = -1;
		this.queueLock = false;
		this.readyLock = false;

		this.connection.on('stateChange', async (_, newState) => {
			if (newState.status === VoiceConnectionStatus.Disconnected) {
				if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
					/**
					 * If the WebSocket closed with a 4014 code, this means that we should not manually attempt to reconnect,
					 * but there is a chance the connection will recover itself if the reason of the disconnect was due to
					 * switching voice channels. This is also the same code for the bot being kicked from the voice channel,
					 * so we allow 5 seconds to figure out which scenario it is. If the bot has been kicked, we should destroy
					 * the voice connection.
					 */
					try {
						await entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000);
						// Probably moved voice channel
					} catch {
						if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) this.connection.destroy();
						// Probably removed from voice channel
					}
				} else if (this.connection.rejoinAttempts < 10) {
					/**
					 * The disconnect in this case is recoverable, and we also have <10 repeated attempts so we will reconnect.
					 */
					await wait((this.connection.rejoinAttempts + 1) * 5_000);
					this.connection.rejoin();
				} else {
					/**
					 * The disconnect in this case may be recoverable, but we have no more remaining attempts - destroy.
					 */
					options.msg.channel.send("tried rejoining but could not reconnect");
					if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) this.connection.destroy();
				}
			} else if (newState.status === VoiceConnectionStatus.Destroyed) {
				/**
				 * Once destroyed, stop the subscription.
				 */
				this.end();
			} else if (
				!this.readyLock &&
				(newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)
			) {
				/**
				 * In the Signalling or Connecting states, we set a 20 second time limit for the connection to become ready
				 * before destroying the voice connection. This stops the voice connection permanently existing in one of these
				 * states.
				 */
				this.readyLock = true;
				try {
					await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
				} catch {
					if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) this.connection.destroy();
				} finally {
					this.readyLock = false;
				}
			}
		});

		this.player.on('stateChange', (oldState, newState) => {
			if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
				// If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
				// The queue is then processed to start playing the next track, if one is available.
				(oldState.resource).metadata.onFinish();
				this.processQueue();
			} else if (newState.status === AudioPlayerStatus.Playing) {
				// If the Playing state has been entered, then a new track has started playback.
				(newState.resource).metadata.onStart();
			}
		});

		this.connection.subscribe(this.player);
	}	

	enqueue(song) {
		this.queue.push(song);
		this.processQueue();
	}

	end() {
		this.queueLock = true;
		this.queue = [];
		this.player.stop(true);
	}

	async processQueue() {
		// If the queue is locked (already being processed) or song is being played or queue is empty, return
		if (this.queueLock || this.player.state.status !== AudioPlayerStatus.Idle || this.queue.length === 0) {
			return;
		}
		// before processing, lock the queue
		this.queueLock = true;

		this.queueIndex = (this.queueIndex + 1) % this.queue.length; // will always auto loop queue
		const nextSong = this.queue[this.queueIndex];
		try {
			// convert song to audio resource
			const audioResource = await nextSong.createAudioResourceCustom();
			this.player.play(audioResource);
			this.queueLock = false;
		} catch (error) {
			// If an error occurred, try the next item of the queue instead
			nextSong.onError(error => console.log(error));
			this.queueLock = false;
			return this.processQueue();
		}
	}
}

module.exports = MusicSubscription;