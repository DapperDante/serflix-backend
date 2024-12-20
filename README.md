# Server-Serflix

It's focused about manage control of accounts (this case was used user to describe it) and profiles, There are many APIs for diferent case but each of them has structure and similarity with others like ``/api/movies/get`` and ``/api/series/get`` both APIs have same structure but 
there are some diference about the response

## API

All request have prefix ``/api/``, the next table you can see the options about each Api: 

| Name | Options | Parameters|
|----------|---------|-----------|
| ``/user`` | ``/add``   | ``username, email, password`` |
|    | ``/verify`` | ``username, password`` |
| ``/profile`` | ``/add`` | ``user_id, name, img`` |
|| ``/get/:idUser`` | ``none`` | 
|| ``/get/:idUser/:idProfile`` | ``none`` | 
| ``/movie`` | ``/get/:idProfile`` | ``none`` |
|| ``/get/:idProfile/:idMovie`` | ``none`` |
|| ``/add`` | ``profile_id, movie_id`` |
|| ``/delete/:id`` | ``none`` |
| ``/serie`` | ``/get/:idProfile`` | ``none`` |
|| ``/get/:idProfile/:idSerie`` | ``none`` |
|| ``/add`` | ``profile_id, serie_id`` |
|| ``/delete/:id`` | ``none`` |
| ``/score`` | ``/movie/add`` | ``profile_id, movie_id, score, review`` |
|| ``/movie/get/:idMovie`` | ``none`` |
|| ``/serie/add`` | ``profile_id, serie_id, score, review`` |
|| ``/serie/get/:idSerie`` | ``none`` |
| ``/search`` | ``/movies?query=your_query&times=any_number&manyItemsRelation=any_number`` | ``none`` |

When you request of search you must add queries for IA (tensorflow/tfjs-node and universal-sentence-encoder) can work to research on the data's database:
**where**: 
- **query:** only can string, this query reference about movie's description or title
- **times:** it's a number of data's area to research, if you want big area to get more precition, so 
you could put high number but your request could be slow
- **manyItemsRelation:**: number of how to many item returned after research but there movies will have similar movies added each of them

## development

When you get up this server in development you only introduced in your terminal ``npm run dev``
because that command active ``tsc --watch`` (translate from ts to js) and ``npx nodemon``, that command was base on dependency's concurrently.

## notes

> If you have problem when install package like @tensorflow/tfjs-node and @tensorflow-models/universal-sentence-encoder, you must force that process or install latest version of visual studio and python (the best way update or installation is directly when you install node), but you have problem yet, so in the node_modules you must move file "tensorflow.dll" from "node_modules\@tensorflow\tfjs-node\lib\napi-v9" to "node_modules\@tensorflow\tfjs-node\lib\napi-v8".