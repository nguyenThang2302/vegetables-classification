const MediaMapper = module.exports;

MediaMapper.toImageUrlResponse = (name, url) => ({ data: { name: name, url: url }});
MediaMapper.toImagesHistoryResponse = (data) => ({ items: data });
MediaMapper.toImageDetailResponse = (data) => ({ data: data });
