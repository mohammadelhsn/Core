import axios from 'axios';
import * as dotenv from 'dotenv';
import Responses from './Structures/Interfaces/Response';
import moment from 'moment';
import { Utils } from './Functions';
import BaseObj from './Structures/BaseObj';

dotenv.config();

namespace API {
	export class Animals {
		async Alpaca(): Promise<BaseObj> {
			try {
				const res = await axios.get(`https://apis.duncte123.me/animal/alpaca`);
				const body = <Responses.Duncte123Response>res.data;

				return new BaseObj({
					error: false,
					file: body.data.file,
					id: body.data.id,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Bird(): Promise<BaseObj> {
			try {
				const res = await axios.get(`https://apis.duncte123.me/animal/bird`);
				const body = <Responses.Duncte123Response>res.data;

				return new BaseObj({
					error: false,
					file: body.data.file,
					id: body.data.id,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Camel(): Promise<BaseObj> {
			try {
				const res = await axios.get(`https://apis.duncte123.me/animal/bird`);
				const body = <Responses.Duncte123Response>res.data;

				return new BaseObj({
					error: false,
					file: body.data.file,
					id: body.data.id,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Cat(): Promise<BaseObj> {
			try {
				const res = await axios.get(`http://aws.random.cat/meow`);
				const body = <Responses.RandomCat>res.data;

				return new BaseObj({
					error: false,
					file: body.file,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Dog(): Promise<BaseObj> {
			try {
				const res = await axios.get(`https://dog.ceo/api/breeds/image/random`);
				const body = <Responses.RandomDog>res.data;

				return new BaseObj({
					error: false,
					file: body.message,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Duck(): Promise<BaseObj> {
			try {
				const res = await axios.get(`https://apis.duncte123.me/animal/duck`);
				const body = <Responses.Duncte123Response>res.data;

				return new BaseObj({
					error: false,
					file: body.data.file,
					id: body.data.id,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Fox(): Promise<BaseObj> {
			try {
				const res = await axios.get(`https://apis.duncte123.me/animal/fox`);
				const body = <Responses.Duncte123Response>res.data;

				return new BaseObj({
					error: false,
					file: body.data.file,
					id: body.data.id,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Goose(): Promise<BaseObj> {
			try {
				const res = await axios.get(`https://nekos.life/api/v2/img/goose`);
				const body = <Responses.NekosLifeAnimal>res.data;

				return new BaseObj({
					error: false,
					file: body.url,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Kangaroo() {
			try {
				const res = await axios.get(
					`https://some-random-api.ml/animal/kangaroo`
				);
				const body = <Responses.SomeRandomApi>res.data;

				return new BaseObj({
					error: false,
					file: body.image,
					text: body.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Koala() {
			try {
				const res = await axios.get(`https://some-random-api.ml/animal/koala`);
				const body = <Responses.SomeRandomApi>res.data;

				return new BaseObj({
					error: false,
					file: body.image,
					text: body.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Lizard() {
			try {
				const res = await axios.get(`https://apis.duncte123.me/animal/lizard`);
				const body = <Responses.Duncte123Response>res.data;

				return new BaseObj({
					error: false,
					file: body.data.file,
					id: body.data.id,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Llama() {
			try {
				const res = await axios.get(`https://apis.duncte123.me/animal/llama`);
				const body = <Responses.Duncte123Response>res.data;

				return new BaseObj({
					error: true,
					id: body.data.id,
					file: body.data.file,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Meow() {
			try {
				const res = await axios.get(`https://nekos.life/api/v2/img/meow`);
				const body = <Responses.NekosLifeAnimal>res.data;

				return new BaseObj({
					error: false,
					file: body.url,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Monster() {
			try {
				const res = await axios.get(
					`https://apis.duncte123.me/animal/discord-monster`
				);
				const body = <Responses.Duncte123Response>res.data;

				return new BaseObj({
					error: false,
					id: body.data.id,
					file: body.data.file,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Panda() {
			try {
				const res = await axios.get(`https://apis.duncte123.me/animal/panda`);
				const body = <Responses.Duncte123Response>res.data;

				return new BaseObj({
					error: false,
					id: body.data.id,
					file: body.data.file,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Racoon() {
			try {
				const res = await axios.get(`https://some-random-api.ml/animal/racoon`);
				const body = <Responses.SomeRandomApi>res.data;

				return new BaseObj({
					error: false,
					file: body.image,
					text: body.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Redpanda() {
			try {
				const res = await axios.get(
					`https://some-random-api.ml/animal/red_panda`
				);
				const body = <Responses.SomeRandomApi>res.data;

				return new BaseObj({
					error: false,
					file: body.image,
					text: body.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Seal() {
			try {
				const res = await axios.get(`https://apis.duncte123.me/animal/seal`);
				const body = <Responses.Duncte123Response>res.data;

				return new BaseObj({
					error: false,
					file: body.data.file,
					id: body.data.id,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Shibe() {
			try {
				const res = await axios.get(
					`http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`
				);
				const body = <Responses.ShibeOnline>res.data;

				return new BaseObj({
					error: false,
					file: body[0],
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Wolf() {
			try {
				const res = await axios.get(`https://apis.duncte123.me/animal/wolf`);
				const body = <Responses.Duncte123Response>res.data;

				return new BaseObj({
					error: false,
					file: body.data.file,
					id: body.data.id,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Woof() {
			try {
				const res = await axios.get(`https://nekos.life/api/v2/img/woof`);
				const body = <Responses.NekosLifeAnimal>res.data;

				return new BaseObj({
					error: false,
					file: body.url,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
	}
	export class Canvas {
		async Baguette(image: string) {
			try {
				const res = await axios.get(
					`https://nekobot.xyz/api/imagegen?type=baguette&url=${image}`
				);
				const data = <Responses.NekoBotCanvas>res.data;

				if (data.status != 200 || data.success == false) {
					return new BaseObj({
						error: true,
						error_type: `Error code: ${data.status}`,
						error_message: data.message,
					});
				}

				return new BaseObj({
					error: false,
					file: data.message,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Blurpify(image: string) {
			try {
				const res = await axios.get(
					`https://nekobot.xyz/api/imagegen?type=blurpify&url=${image}`
				);
				const data = <Responses.NekoBotCanvas>res.data;

				if (data.status != 200 || data.success == false) {
					return new BaseObj({
						error: true,
						error_type: `Error code: ${data.status}`,
						error_message: data.message,
					});
				}

				return new BaseObj({
					error: false,
					file: data.message,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Captcha(image: string, text: string) {
			try {
				const res = await axios.get(
					`https://nekobot.xyz/api/imagegen?type=captcha&url=${image}`
				);
				const data = <Responses.NekoBotCanvas>res.data;

				if (data.status != 200 || data.success == false) {
					return new BaseObj({
						error: true,
						error_type: `Error code: ${data.status}`,
						error_message: data.message,
					});
				}

				return new BaseObj({
					error: false,
					file: data.message,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Cheat(image: string, image2: string) {
			try {
				const res = await axios.get(
					`https://nekobot.xyz/api/imagegen?type=ship&user1=${image}&user2=${image2}`
				);
				const data = <Responses.NekoBotCanvas>res.data;

				if (data.status != 200 || data.success == false) {
					return new BaseObj({
						error: true,
						error_type: `Error code: ${data.status}`,
						error_message: data.message,
					});
				}

				return new BaseObj({
					error: false,
					file: data.message,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Clyde(text: string) {
			try {
				const res = await axios.get(
					`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`
				);
				const data = <Responses.NekoBotCanvas>res.data;

				if (data.status != 200 || data.success == false) {
					return new BaseObj({
						error: true,
						error_type: `Error code: ${data.status}`,
						error_message: data.message,
					});
				}

				return new BaseObj({
					error: false,
					file: data.message,
				});
			} catch (error) {}
		}
		Comment(image: string, username: string, comment: string) {
			try {
				const link = `https://some-random-api.ml/canvas/youtube-comment/?avatar=${image}&username=${username}&comment=${comment}`;
				return new BaseObj({
					error: false,
					file: link,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		Gay(image: string) {
			try {
				const link = `https://some-random-api.ml/canvas/gay/?avatar=${image}`;
				return new BaseObj({
					error: false,
					file: link,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async iPhoneX(image: string) {
			try {
				const res = await axios.get(
					`https://nekobot.xyz/api/imagegen?type=iphonex&url=${image}`
				);
				const data = <Responses.NekoBotCanvas>res.data;

				if (data.status != 200 || data.success == false) {
					return new BaseObj({
						error: true,
						error_type: `Error code: ${data.status}`,
						error_message: data.message,
					});
				}

				return new BaseObj({
					error: false,
					file: data.message,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Phcomment(image: string, username: string, comment: string) {
			try {
				const res = await axios.get(
					`https://nekobot.xyz/api/imagegen?type=phcomment&image=${image}&comment=${comment}&username=${username}`
				);
				const data = <Responses.NekoBotCanvas>res.data;

				if (data.status != 200 || data.success == false) {
					return new BaseObj({
						error: true,
						error_type: `Error code: ${data.status}`,
						error_message: data.message,
					});
				}

				return new BaseObj({
					error: false,
					file: data.message,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Triggered(image: string) {
			try {
				const link = `https://some-random-api.ml/canvas/triggered/?avatar=${image}`;
				return new BaseObj({
					error: false,
					file: link,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Tweet(username: string, comment: string) {
			try {
				const res = await axios.get(
					`https://nekobot.xyz/api/imagegen?tweet=iphonex&username=${username}&comment=${comment}`
				);
				const data = <Responses.NekoBotCanvas>res.data;

				if (data.status != 200 || data.success == false) {
					return new BaseObj({
						error: true,
						error_type: `Error code: ${data.status}`,
						error_message: data.message,
					});
				}

				return new BaseObj({
					error: false,
					file: data.message,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Wasted(image: string) {
			try {
				const link = `https://some-random-api.ml/canvas/wasted/?avatar=${image}`;
				return new BaseObj({
					error: false,
					file: link,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Whowouldwin(image: string, image2: string) {
			try {
				const res = await axios.get(
					`https://nekobot.xyz/api/imagegen?type=whowouldwin&user1=${image}&user2${image2}`
				);
				const data = <Responses.NekoBotCanvas>res.data;

				if (data.status != 200 || data.success == false) {
					return new BaseObj({
						error: true,
						error_type: `Error code: ${data.status}`,
						error_message: data.message,
					});
				}

				return new BaseObj({
					error: false,
					file: data.message,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
	}
	export class Facts {
		async Birdfact() {
			try {
				const res = await axios.get(`https://some-random-api.ml/facts/bird`);
				const data = <Responses.FactsResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Catfact() {
			try {
				const res = await axios.get(`https://some-random-api.ml/facts/cat`);
				const data = <Responses.FactsResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Dogfact() {
			try {
				const res = await axios.get(`https://some-random-api.ml/facts/dog`);
				const data = <Responses.FactsResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Elephantfact() {
			try {
				const res = await axios.get(
					`https://some-random-api.ml/facts/elephant`
				);
				const data = <Responses.FactsResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Fact() {
			try {
				const res = await axios.get(`https://nekos.life/api/v2/fact`);
				const data = <Responses.FactsResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Foxfact() {
			try {
				const res = await axios.get(`https://some-random-api.ml/facts/fox`);
				const data = <Responses.FactsResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Giraffefact() {
			try {
				const res = await axios.get(`https://some-random-api.ml/facts/giraffe`);
				const data = <Responses.FactsResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Kangaroofact() {
			try {
				const res = await axios.get(
					`https://some-random-api.ml/facts/kangaroo`
				);
				const data = <Responses.FactsResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Koalafact() {
			try {
				const res = await axios.get(`https://some-random-api.ml/facts/koala`);
				const data = <Responses.FactsResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Pandafact() {
			try {
				const res = await axios.get(`https://some-random-api.ml/facts/panda`);
				const data = <Responses.FactsResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Racoonfact() {
			try {
				const res = await axios.get(`https://some-random-api.ml/facts/racoon`);
				const data = <Responses.FactsResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Whalefact() {
			try {
				const res = await axios.get(
					`https://some-random-api.ml/facts/whalefact`
				);
				const data = <Responses.FactsResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.fact,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
	}
	export class Fun {
		async Advice() {
			try {
				const res = await axios.get(`http://api.adviceslip.com/advice`);
				const data = <Responses.AdviceResponse>res.data;

				return new BaseObj({
					error: false,
					id: data.slip.id,
					text: data.slip.advice,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Baka() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/baka`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Cattext() {
			try {
				const res = await axios.get(`https://nekos.life/api/v2/cat`);
				const data = <Responses.NekosLifeCat>res.data;

				return new BaseObj({ error: false, text: data.cat });
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Changemymind(text: string) {
			try {
				const res = await axios.get(
					`https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`
				);
				const data = <Responses.NekoBotCanvas>res.data;

				if (data.status != 200 || data.success == false) {
					return new BaseObj({
						error: true,
						error_type: `Error code: ${data.status}`,
						error_message: data.message,
					});
				}

				return new BaseObj({
					error: false,
					file: data.message,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Foxgirl() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/foxgirl`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Joke() {
			try {
				const res = await axios.get(`https://some-random-api.ml/joke`);
				const data = <Responses.JokeResponse>res.data;

				return new BaseObj({
					error: false,
					text: data.joke,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Name() {
			try {
				const res = await axios.get(`https://nekos.life/api/v2/name`);
				const data = <Responses.NekosLifeName>res.data;

				return new BaseObj({
					error: false,
					text: data.name,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Neko() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/neko`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {}
		}
		async OwO(text: string) {
			try {
				const res = await axios.get(
					`https://nekos.life/api/v2/owoify?text=${text}`
				);
				const data = <Responses.OwO_Response>res.data;

				return new BaseObj({ error: false, text: data.owo });
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Spoiler(text: string) {
			try {
				const res = await axios.get(
					`https://nekos.life/api/v2/spoiler?text=${text}`
				);
				const data = <Responses.NekosLifeSpoiler>res.data;

				return new BaseObj({
					error: false,
					text: data.text,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Truth(text: string) {}
		async Waifu() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/waifu`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Wallpaper() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/wallpaper`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Why() {
			try {
				const res = await axios.get(`https://nekos.life/api/v2/why`);
				const data = <Responses.NekosLifeWhy>res.data;

				return new BaseObj({
					error: false,
					text: data.why,
				});
			} catch (error) {
				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
	}
	export class Memes {
		async Prequelmeme() {
			try {
				const res = await axios.get(
					`https://www.reddit.com/r/PrequelMemes.json?sort=top&t=week`
				);
				const data = <Responses.Post[]>res.data.data.children;

				const posts = data
					.filter((post) => post.data.over_18 == false)
					.filter((post) => post.data.is_video == false);

				if (posts.length == 0) {
					return new BaseObj({
						error: true,
						error_message: 'No memes found',
						error_type: 'N/A',
					});
				}

				const ranNum = Math.floor(Math.random() * posts.length);

				const postData = posts[ranNum];

				return new BaseObj({
					error: false,
					title: postData.data.title,
					text: `Posted by: \`${postData.data.author}\``,
					file: postData.data.url,
					author: postData.data.author,
					link: `https://www.reddit.com${postData.data.permalink}`,
					misc: {
						upvotes: postData.data.ups,
						downvotes: postData.data.downs,
						subreddit: postData.data.subreddit_name_prefixed,
						postedAt: moment
							.unix(postData.data.created)
							.format('dddd, MMMM Do YYYY, h:mm:ss a'),
					},
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Equelmeme(): Promise<BaseObj> {
			try {
				const res = await axios.get(
					`https://www.reddit.com/r/equelMemes.json?sort=top&t=week`
				);
				const data = <Responses.Post[]>res.data.data.children;

				const posts = data
					.filter((post) => post.data.over_18 == false)
					.filter((post) => post.data.is_video == false);

				if (posts.length == 0) {
					return new BaseObj({
						error: true,
						error_message: 'No memes found!',
						error_type: 'N/A',
					});
				}

				const ranNum = Math.floor(Math.random() * posts.length);

				const postData = posts[ranNum];

				return new BaseObj({
					error: false,
					title: postData.data.title,
					text: `Posted by: \`${postData.data.author}\``,
					file: postData.data.url,
					author: postData.data.author,
					link: `https://www.reddit.com${postData.data.permalink}`,
					misc: {
						upvotes: postData.data.ups,
						downvotes: postData.data.downs,
						subreddit: postData.data.subreddit_name_prefixed,
						postedAt: moment
							.unix(postData.data.created)
							.format('dddd, MMMM Do YYYY, h:mm:ss a'),
					},
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async OTmeme() {
			try {
				const res = await axios.get(
					`https://www.reddit.com/r/OTMemes.json?sort=top&t=week`
				);
				const data = <Responses.Post[]>res.data.data.children;

				const posts = data
					.filter((post) => post.data.over_18 == false)
					.filter((post) => post.data.is_video == false);

				if (posts.length == 0) {
					return new BaseObj({
						error: true,
						error_message: 'No memes found!',
						error_type: 'N/A',
					});
				}

				const ranNum = Math.floor(Math.random() * posts.length);

				const postData = posts[ranNum];

				return new BaseObj({
					error: false,
					title: postData.data.title,
					text: `Posted by: \`${postData.data.author}\``,
					file: postData.data.url,
					author: postData.data.author,
					link: `https://www.reddit.com${postData.data.permalink}`,
					misc: {
						upvotes: postData.data.ups,
						downvotes: postData.data.downs,
						subreddit: postData.data.subreddit_name_prefixed,
						postedAt: moment
							.unix(postData.data.created)
							.format('dddd, MMMM Do YYYY, h:mm:ss a'),
					},
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Sequelmeme() {
			try {
				const res = await axios.get(
					`https://www.reddit.com/r/SequelMemes.json?sort=top&t=week`
				);
				const data = <Responses.Post[]>res.data.data.children;

				const posts = data
					.filter((post) => post.data.over_18 == false)
					.filter((post) => post.data.is_video == false);

				if (posts.length == 0) {
					return new BaseObj({
						error: true,
						error_message: 'No memes found!',
						error_type: 'N/A',
					});
				}

				const ranNum = Math.floor(Math.random() * posts.length);

				const postData = posts[ranNum];

				return new BaseObj({
					error: false,
					title: postData.data.title,
					text: `Posted by: \`${postData.data.author}\``,
					file: postData.data.url,
					author: postData.data.author,
					link: `https://www.reddit.com${postData.data.permalink}`,
					misc: {
						upvotes: postData.data.ups,
						downvotes: postData.data.downs,
						subreddit: postData.data.subreddit_name_prefixed,
						postedAt: moment
							.unix(postData.data.created)
							.format('dddd, MMMM Do YYYY, h:mm:ss a'),
					},
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Meme() {
			try {
				const res = await axios.get(`https://apis.duncte123.me/meme`);
				const data = <Responses.Duncte123Meme>res.data;

				return new BaseObj({
					error: false,
					title: data.data.title,
					file: data.data.image,
					link: data.data.url,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
	}
	export class Miscellaneous {
		async Anime(query: string) {
			try {
				const res = await axios.get(
					`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(
						query
					)}`
				);
				const data = <Responses.Anime[]>res.data.data;

				const { FormatNumber, Capitalize } = new Utils();

				const animes = [];
				for (let anime of data) {
					const names = anime.attributes.abbreviatedTitles
						? anime.attributes.abbreviatedTitles.map((a) => a).join(' ')
						: 'N/A';

					const obj = new BaseObj({
						error: false,
						file: anime.attributes.posterImage.original,
						title: `${anime.attributes.titles.en_jp} | ${anime.attributes.titles.ja_jp}`,
						text: anime.attributes.description
							? anime.attributes.description
							: `N/A`,
						link: anime.links.self,
						id: anime.id,
						misc: {
							names: names,
							averageRating: anime.attributes.averageRating,
							userCount: FormatNumber(anime.attributes.userCount),
							favouriteCount: FormatNumber(anime.attributes.favoritesCount),
							status: Capitalize(anime.attributes.status),
							startDate: anime.attributes.startDate,
							endDate: anime.attributes.endDate
								? anime.attributes.endDate
								: 'N/A',
							nextRelease: anime.attributes.nextRelease
								? anime.attributes.nextRelease
								: 'N/A',
							ageRating: anime.attributes.ageRating
								? anime.attributes.ageRating
								: 'N/A',
							ageRatingGuide: anime.attributes.ageRatingGuide
								? anime.attributes.ageRatingGuide
								: 'N/A',
							episodeCount: anime.attributes.episodeCount
								? FormatNumber(anime.attributes.episodeCount)
								: 'N/A',
							youtubeURL:
								anime.attributes.youtubeVideoId == null
									? `https://www.youtube.com/watch?v=${anime.attributes.youtubeVideoId}`
									: 'N/A',
							nsfw: anime.attributes.nsfw == true ? 'Yes' : 'No',
						},
					});
					animes.push(obj);
				}
				return animes as BaseObj[];
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Collection(query: string) {
			try {
				const url = `https://djsdocs.sorta.moe/v2/embed?src=collection&q=${encodeURIComponent(
					query
				)}`;
				const res = await axios.get(url);
				const embed = res.data;

				if (!embed || embed.error)
					return new BaseObj({
						error: true,
						error_message: 'No result(s) found',
						error_type: 'Status code: 404',
					});

				return embed;
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Commando(query: string) {
			try {
				const url = `https://djsdocs.sorta.moe/v2/embed?src=commando&q=${encodeURIComponent(
					query
				)}`;
				const res = await axios.get(url);
				const embed = res.data;

				if (!embed || embed.error)
					return new BaseObj({
						error: true,
						error_message: 'No result(s) found',
						error_type: 'Status code: 404',
					});

				return embed;
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async DiscordJS(query: string) {
			try {
				const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(
					query
				)}`;
				const res = await axios.get(url);
				const embed = res.data;

				if (!embed || embed.error)
					return new BaseObj({
						error: true,
						error_message: 'No result(s) found',
						error_type: 'Status code: 404',
					});

				return embed;
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async EmojiGG(type: 'category' | 'emoji', query: string) {
			try {
				const category = {
					1: 'Original Style',
					18: 'Recolors',
					2: 'TV / Movie',
					10: 'Gaming',
					3: 'Meme',
					4: 'Anime',
					13: 'Pepe',
					5: 'Celebrity',
					6: 'Blobs',
					7: 'Thinking',
					17: 'Animals',
					15: 'Cute',
					11: 'Letters',
					14: 'Logos',
					16: 'Utility',
					19: 'Flags',
					20: 'Hearts',
					12: 'Other',
					8: 'Animated',
					9: 'NSFW',
				};

				if (type == 'category') {
					const flags = {
						'original style': 1,
						recolors: 18,
						movie: 2,
						gaming: 10,
						meme: 3,
						anime: 4,
						pepe: 13,
						celebrity: 5,
						blobs: 6,
						thinking: 7,
						animals: 17,
						cute: 15,
						letters: 11,
						logos: 14,
						utility: 16,
						flags: 19,
						hearts: 20,
						other: 12,
						animated: 8,
						nsfw: 9,
					};

					const flag = flags[query.toLowerCase()];

					const res = await axios.get(`https://emoji.gg/api/`);
					const data = <Responses.Emoji[]>res.data;

					const emojis = data.filter((e) => e.category == flag);

					if (emojis.length == 0) return emojis;

					const Emojis = [];
					for (let emoji of emojis) {
						const obj = new BaseObj({
							error: false,
							title: emoji.title,
							file: emoji.image,
							text: emoji.description,
							author: emoji.submitted_by,
							id: emoji.id,
							misc: {
								category: category[emoji.category],
								faves: emoji.faves,
								license: emoji.license,
							},
							link: `https://emoji.gg/emoji/${emoji.slug}`,
						});
						Emojis.push(obj);
					}
					return Emojis as BaseObj[];
				}

				const res = await axios.get(`https://emoji.gg/api/`);
				const data = <Responses.Emoji[]>res.data;

				const emojis = data.filter((e) =>
					e.title.toLowerCase().includes(query.toLowerCase())
				);

				if (emojis.length == 0) return emojis;

				const Emojis = [];
				for (let emoji of emojis) {
					const obj = new BaseObj({
						error: false,
						title: emoji.title,
						file: emoji.image,
						text: emoji.description,
						author: emoji.submitted_by,
						id: emoji.id,
						misc: {
							category: category[emoji.category],
							faves: emoji.faves,
							license: emoji.license,
						},
						link: `https://emoji.gg/emoji/${emoji.slug}`,
					});
					Emojis.push(obj);
				}
				return Emojis as BaseObj[];
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Lyrics(query: string) {
			try {
				const res = await axios.get(
					`https://some-random-api.ml/lyrics?title=${encodeURI(query)}`
				);
				const data = <Responses.Lyrics>res.data;

				if (!data.title)
					return new BaseObj({
						error: true,
						error_type: `Status code: 404`,
						error_message: 'No result(s) found',
					});

				return new BaseObj({
					error: false,
					title: data.title,
					author: data.author,
					file: data.thumbnail.genius,
					link: data.links.genius,
					text: data.lyrics,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async RedditUser(query: string) {
			try {
				const res = await axios.get(
					`https://www.reddit.com/user/${query}/about.json`
				);
				const data = <Responses.RedditUser>res.data;

				if (!data.data)
					return new BaseObj({
						error: true,
						error_type: `Status code: 404`,
						error_message: `I couldn't find this user!`,
					});

				if (data.data.hide_from_robots == true)
					return new BaseObj({
						error: true,
						error_type: `Status: OK`,
						error_message: `This user is hideen from robots`,
					});

				const { FormatNumber } = new Utils();

				return new BaseObj({
					error: false,
					file: data.data.icon_img.replace(/(amp;)/gi, ''),
					title: data.data.subreddit.display_name_prefixed,
					link: `https://reddit.com/${data.data.subreddit.url}`,
					misc: {
						totalKarma: FormatNumber(data.data.total_karma),
						created_at: moment
							.unix(data.data.created)
							.format('dddd, MMMM Do YYYY, h:mm:ss a'),
						employee: data.data.is_employee ? 'Yes' : 'No',
						premium: data.data.is_gold ? 'Yes' : 'No',
					},
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Subreddit(query: string) {
			try {
				const res = await axios.get(
					`https://www.reddit.com/r/${query}/about.json`
				);
				const data = <Responses.Subreddit>res.data;

				const { Capitalize, FormatNumber } = new Utils();

				return new BaseObj({
					error: false,
					file: data.data.community_icon.replace(/(amp;)/gi, ''),
					title: data.data.display_name_prefixed,
					text: data.data.public_description,
					link: `https://reddit.com/${data.data.url}`,
					misc: {
						type: Capitalize(data.data.subreddit_type),
						language: data.data.lang.toUpperCase(),
						subscribers: FormatNumber(data.data.subscribers),
						active: FormatNumber(data.data.accounts_active),
						quarantined: data.data.quarantine ? 'Yes' : 'No',
						nsfw: data.data.over18 ? 'Yes' : 'No',
						created_at: moment
							.unix(data.data.created)
							.format('dddd, MMMM Do YYYY, h:mm:ss a'),
						banner: data.data.banner_background_image
							? data.data.banner_background_image.replace(/(amp;)/gi, '')
							: '',
					},
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async RPC(query: string) {}
		GetStatus(state: number) {
			try {
				const arr = [
					'Offline / Private account',
					'Online',
					'Busy',
					'Away',
					'Snooze',
					'Looking to trade',
					'Looking to play',
				];

				if (!state) return 'N/A';
				return arr[state];
			} catch (error) {
				console.log(error);

				return 'N/A';
			}
		}
		async SteamUserLocation(country?: string, state?: string, city?: number) {
			if (!country || country == undefined) country = null;
			if (!state || state == undefined) state = null;
			if (!city || city == undefined) city = null;

			try {
				let country_name: string;
				let state_name: string;
				let city_name: string;

				if (country != null) {
					const res = await axios.get(
						`https://steamcommunity.com/actions/QueryLocations/`
					);
					const data = res.data;

					const c_name = data.filter((e) => e.countrycode == country)[0];

					country_name = c_name.countryname;
				}
				if (country != null && state != null) {
					const res = await axios.get(
						`https://steamcommunity.com/actions/QueryLocations/${country}/`
					);
					const data = res.data;

					const s_name = data.filter((e) => e.statecode == state)[0];

					state_name = s_name.statename;
				}
				if (country != null && state != null && city != null) {
					const res = await axios.get(
						`https://steamcommunity.com/actions/QueryLocations/${country}/${state}`
					);
					const data = res.data;

					const ci_name = data.filter((e) => e.cityid == city)[0];

					city_name = ci_name.cityname;
				}

				return `Country: ${
					country == null ? 'N/A' : country_name
				}\nState/Province: ${state == null ? 'N/A' : state_name}\nCity: ${
					city == null ? 'N/A' : city_name
				}`;
			} catch (error) {
				console.log(error);

				return `Country: N/A\nState/Province: N/A\nCity: N/A`;
			}
		}
		async SteamUserInfo(query: string) {
			try {
				const res = await axios.get(
					`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${process.env.STEAM_KEY}&vanityurl=${query}`
				);
				const data = <Responses.VanityURL>res.data;

				if (data.response.success == 42)
					return new BaseObj({
						error: true,
						error_type: 'Status code: 404',
						error_message: "This user doesn't exist",
					});

				const id = data.response.steamid;

				const response = await axios.get(
					`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_KEY}&steamids=${id}`
				);
				const summary = <Responses.PlayerSummaries>response.data;

				const req = await axios.get(
					`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${process.env.STEAM_KEY}&steamids=${id}`
				);
				const ban = <Responses.PlayerBanRes>req.data;
				const player = summary.response.players[0];
				const bans = ban.players[0];

				if (player.communityvisibilitystate != 3) {
					return new BaseObj({
						error: false,
						file: player.avatarfull,
						title: player.personaname,
						text: `Last log off: ${
							player.lastlogoff
								? moment
										.unix(player.lastlogoff)
										.format('dddd, MMMM Do YYYY, h:mm:ss a')
								: 'N/A'
						}`,
						link: player.profileurl,
						id: player.steamid,
						misc: {
							visibility: `Private`,
							state: this.GetStatus(player.personastate),
							created_at: player.timecreated
								? moment
										.unix(player.timecreated)
										.format('dddd, MMMM Do YYYY, h:mm:ss a')
								: 'N/A',
							community_banned: bans.CommunityBanned == true ? 'Yes' : 'No',
							VACBanned: bans.VACBanned == true ? 'Yes' : 'No',
							NumberOfVACBans:
								bans.NumberOfVACBans == 0 ? 'N/A' : bans.NumberOfVACBans,
							daysSinceLastBan:
								bans.DaysSinceLastBan == 0 ? 'N/A' : bans.DaysSinceLastBan,
							NumberOfGameBans:
								bans.NumberOfGameBans == 0 ? 'N/A' : bans.NumberOfGameBans,
							economyban: bans.EconomyBan,
						},
					});
				}

				return new BaseObj({
					error: false,
					file: player.avatarfull,
					title: player.personaname,
					text: `Last log off: ${
						player.lastlogoff
							? moment
									.unix(player.lastlogoff)
									.format('dddd, MMMM Do YYYY, h:mm:ss a')
							: 'N/A'
					}`,
					link: player.profileurl,
					id: player.steamid,
					misc: {
						visibility: `Public`,
						loaction: await this.SteamUserLocation(
							player.loccountrycode,
							player.locstatecode,
							player.loccityid
						),
						realname: player.realname ? player.realname : 'N/A',
						state: this.GetStatus(player.personastate),
						created_at: player.timecreated
							? moment
									.unix(player.timecreated)
									.format('dddd, MMMM Do YYYY, h:mm:ss a')
							: 'N/A',
						community_banned: bans.CommunityBanned == true ? 'Yes' : 'No',
						VACBanned: bans.VACBanned == true ? 'Yes' : 'No',
						NumberOfVACBans:
							bans.NumberOfVACBans == 0 ? 'N/A' : bans.NumberOfVACBans,
						daysSinceLastBan:
							bans.DaysSinceLastBan == 0 ? 'N/A' : bans.DaysSinceLastBan,
						NumberOfGameBans:
							bans.NumberOfGameBans == 0 ? 'N/A' : bans.NumberOfGameBans,
						economyban: bans.EconomyBan,
					},
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
	}
	export class Reactions {
		async Cry() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/cry`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Cuddle() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/cuddle`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Facepalm() {
			try {
				const res = await axios.get(
					`https://some-random-api.ml/animu/face-palm`
				);
				const data = <Responses.AnimuSRA>res.data;

				return new BaseObj({
					error: false,
					file: data.link,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Feed() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/feed`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Hug() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/hug`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Laugh() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/laugh`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Lick() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/lick`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Kiss() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/kiss`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Pat() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/pat`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Poke() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/poke`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Slap() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/slap`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Smack() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/spank`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Smug() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/smug`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Tickle() {
			try {
				const res = await axios.get(`http://api.nekos.fun:8080/api/tickle`);
				const data = <Responses.NekosFun>res.data;

				return new BaseObj({
					error: false,
					file: data.image,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
		async Wink() {
			try {
				const res = await axios.get(`https://some-random-api.ml/animu/wink`);
				const data = <Responses.AnimuSRA>res.data;

				return new BaseObj({
					error: false,
					file: data.link,
				});
			} catch (error) {
				console.log(error);

				return new BaseObj({
					error: true,
					error_type: (error as Error).name ? (error as Error).name : null,
					error_message: (error as Error).message
						? (error as Error).message
						: null,
				});
			}
		}
	}
}

export = API;
