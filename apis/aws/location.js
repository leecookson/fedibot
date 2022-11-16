const { LocationClient, SearchPlaceIndexForPositionCommand } = require("@aws-sdk/client-location");

// a client can be shared by different commands.
const client = new LocationClient({ region: "us-east-1" });

// sample position: [-123.1174, 49.2847]
module.exports = {
  getGeoData: async(position) => {
    const params = {
      Position: position
    };
    const command = new SearchPlaceIndexForPositionCommand(params);

    // async/await.
    try {
      const data = await client.send(command);
      // process data.
      return data;
    } catch (error) {
      // error handling.
    } finally {
      // finally.
    }
  }
};