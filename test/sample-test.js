const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('NFTMarket', function () {
  it('It should create and execute market sales', async function () {
    const MarketFactory = await ethers.getContractFactory('NFTMarket');
    const marketContract = await MarketFactory.deploy();
    await marketContract.deployed();

    const marketAddress = marketContract.address;

    const NFTFactory = await ethers.getContractFactory('NFT');
    const NFTContract = await NFTFactory.deploy(marketAddress);
    await NFTContract.deployed();

    const nftContractAddress = NFTContract.address;

    let listingPrice = await marketContract.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = ethers.utils.parseUnits('100', 'ether');

    await NFTContract.createToken('https://www.mytokenlocation.com');
    await NFTContract.createToken('https://www.mytokenlocation2.com');

    await marketContract.createMarketItem(nftContractAddress, 1, auctionPrice, {
      value: listingPrice,
    });
    await marketContract.createMarketItem(nftContractAddress, 2, auctionPrice, {
      value: listingPrice,
    });

    const [_, buyerAddress] = await ethers.getSigners();

    await marketContract
      .connect(buyerAddress)
      .createMarketSale(nftContractAddress, 1, { value: auctionPrice });

    let items = await marketContract.fetchMarketItems();

    items = await Promise.all(
      items.map(async (i) => {
        const tokenURI = await NFTContract.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenURI,
        };
        return item
      })
    );
    console.log('Items: ', items);
  });
});
