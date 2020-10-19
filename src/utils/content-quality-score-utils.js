export function flattenContentQualityDetail(quality_detail) {
    const {imageContentScores, keywordContentScores, libContentScores} = quality_detail;
    return [
        {code: 'k3yw0rd', title: 'Keyword scoring detail'},
        ...(keywordContentScores.map((quality, i) => ({...quality, index: i}))),
        {code: '1mag3', title: 'Product image scoring detail'},
        ...(imageContentScores.map((quality, i) => ({...quality, index: i}))),
        {code: 'c0nt3nt', title: 'Content scoring detail'},
        ...(libContentScores.map((quality, i) => ({...quality, index: i}))),
    ];
}