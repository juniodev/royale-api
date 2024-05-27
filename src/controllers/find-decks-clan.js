const axios = require('axios')
const cheerio = require('cheerio')

const { z } = require('zod')

const schema = z.object({
	tag: z.string({
		required_error: 'tag is required'
	})
})

const url = 'https://royaleapi.com/player/(tag)/decks'

const findDecksClan = async (req, res) => {
	try {
		
		const { tag } = await schema.parseAsync(req.params)
		
		const { data } = await axios.get(url.replace('(tag)', tag))
		
		const $ = cheerio.load(data)
		
		const $decks = $('.deck_segment')
		
		const decks = []
		
		$decks.each((i, e) => {
			
			const $title = $(e).find('.deck_name_link')
			
			const $imgs = $(e).find('.deck_card__four_wide')
			
			const cards = []
			
			$imgs.each((i, e) => {
				
				const $img = $(e).find('img')
				
				cards.push({
					src: $img.attr('src'),
					name: $img.attr('alt')
				})
				
			})
			
			const $link = $(e).find('.qrcode_button')
			
			decks.push({
				name: $title.text().trim(),
				link: $link.attr('data-qrcode'),
				cards: cards
			})
			
		})
		
		return res.status(200).json(decks)
		
	} catch (e) {
		console.log(e)
		if (e instanceof z.ZodError) {
			return res.status(400).json({
				message: error.issues[0].message
			})
		}
		return res.status(500).json({
			message: 'Unknown error, try again.'
		})
		
	}
}

module.exports = { findDecksClan }