return {
    union: function(polygonA, polygonB) {
        return clip(polygonA, polygonB, false, false);
    },
    intersection: function(polygonA, polygonB) {
        return clip(polygonA, polygonB, true, true);
    },
    diff: function(polygonA, polygonB) {
        return clip(polygonA, polygonB, false, true);
    }
};

}));
