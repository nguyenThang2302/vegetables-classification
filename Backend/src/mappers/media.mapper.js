const MediaMapper = module.exports;

MediaMapper.toUploadImageResponse = (name, confidence) => ({ data: { name: name, confidence: confidence }});
MediaMapper.toImagesHistoryResponse = (data) => ({ items: data });
MediaMapper.toImageDetailResponse = (data) => ({ data: data });
