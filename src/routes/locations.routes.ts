import { Router } from "express";
import multer from 'multer'
import knex from '../database/connection'
import multerConfig from '../config/multer'

const locationsRouter = Router()
const upload = multer(multerConfig)

locationsRouter.post('/', async (request, response) => {
    const {
        name,
        image,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items
    } = request.body

    //console.log(request.body)
    console.log(items)

    const location = {
        image,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
    }
    //const transaction = await knex.transaction()

    const newIds = await knex('locations').insert(location)

    const location_id = newIds[0]


    var locationItens: { item_id: Number; location_id: number; }[] = []

    var len = items.length;

    for (var i = 0; i < len; i++) {
        var id = items[i]
        const selectedItem = await knex('items').where('id', id).select('items.title')
        if (selectedItem.length == 0) {
            return response.status(400).json({ message: 'Item not found' })
        }
        console.log(selectedItem)
        locationItens.push({ item_id: id, location_id: location_id });

    }
    console.log(locationItens)

    await knex('location_items').insert(locationItens)

    //await transaction.commit()

    return response.json({
        id: location_id,
        ...location
    })
})

locationsRouter.get('/:id', async (request, response) => {
    const { id } = request.params

    const location = await knex('locations').where('id', id).first()

    if (!location) {
        return response.status(400).json({ message: 'Location not found' })
    }

    const items = await knex('items')
        .join('location_items', 'items.id', '=', 'location_items.item_id')
        .where('location_items.location_id', id)
        .select('items.title')

    return response.json({ location, items })

})

locationsRouter.get('/', async (request, response) => {
    const { city, uf, items } = request.query

    if (city && uf && items) {

        const parsedItems: Number[] = String(items).split(',').map(item => Number(item.trim()))

        const locations = await knex('locations')
            .join('location_items', 'locations.id', '=', 'location_items.location_id')
            .whereIn('location_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('locations.*')

        return response.json(locations)
    } else {
        const locations = await knex('locations').select('*')

        return response.json(locations)
    }
})

locationsRouter.put('/:id', upload.single('image'), async (request, response) => {
    const { id } = request.params
    const image = request.file?.filename
    const location = await knex('locations').where('id', id).first()
    if (!location) {
        return response.status(400).json({ message: 'Location not found' })
    }
    const locationUpdated = {
        ...location,
        image
    }
    await knex('locations').update(locationUpdated).where('id', id)
    return response.json(locationUpdated)

})

locationsRouter.delete('/:id', async (request, response) => {
    const { id } = request.params

    const resp1 = await knex('location_items')
        .del()
        .where('location_id', id)

    const resp2 = await knex('locations')
        .del()
        .where('id', id)

    if (!resp2) {
        return response.status(400).json({ message: 'Location not found' })
    }

    return response.json({ message: 'deleted' })

})


export default locationsRouter