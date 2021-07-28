// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { bagConnectionsToDatatypes, bagConnectionsToTopics } from "./bagConnectionsHelper";

describe("bagConnectionsToDatatypes", () => {
  it("extracts one big list from multiple connections", () => {
    expect(
      bagConnectionsToDatatypes(
        [
          {
            type: "something/points",
            messageDefinition: `
            Point[] points
            ============
            MSG: geometry_msgs/Point
            float64 x
          `,
          },
          {
            type: "something/two_points",
            messageDefinition: `
            Point point1
            Point point2
            ============
            MSG: geometry_msgs/Point
            float64 x
          `,
          },
        ],
        { ros2: false },
      ),
    ).toEqual({
      "something/points": {
        fields: [{ name: "points", type: "geometry_msgs/Point", isArray: true, isComplex: true }],
      },
      "something/two_points": {
        fields: [
          { name: "point1", type: "geometry_msgs/Point", isArray: false, isComplex: true },
          { name: "point2", type: "geometry_msgs/Point", isArray: false, isComplex: true },
        ],
      },
      "geometry_msgs/Point": {
        fields: [{ name: "x", type: "float64", isArray: false, isComplex: false }],
      },
    });
  });
});

describe("bagConnectionsToTopics", () => {
  it("extracts one big list from multiple connections (even with duplicate topics)", () => {
    expect(
      bagConnectionsToTopics(
        [
          {
            topic: "/some/topic/with/points",
            type: "something/points",
            messageDefinition: "",
            md5sum: "",
            callerid: "",
          },
          {
            topic: "/some/topic/with/points",
            type: "something/points",
            messageDefinition: "",
            md5sum: "",
            callerid: "",
          },
          {
            topic: "/some/topic/with/two_points",
            type: "something/two_points",
            messageDefinition: "",
            md5sum: "",
            callerid: "",
          },
        ],
        [],
      ),
    ).toEqual([
      {
        name: "/some/topic/with/points",
        datatype: "something/points",
        numMessages: 0,
      },
      {
        name: "/some/topic/with/two_points",
        datatype: "something/two_points",
        numMessages: 0,
      },
    ]);
  });
});
