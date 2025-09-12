import React from 'react';
import { View } from 'react-native';

type Circle = {
    width: number;
    height: number;
    borderRadius: number;
    fillColor: string;
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
};

export default function CirculeShape(props: Circle) {
    return (
        <View
            style={{
                borderRadius: props.borderRadius,
                height: props.height,
                width: props.width,
                backgroundColor: props.fillColor,
                top: props.top,
                bottom: props.bottom,
                left: props.left,
                right: props.right,
                position: "absolute",
                ...(props.top !== undefined && { top: props.top }),
                ...(props.bottom !== undefined && { bottom: props.bottom }),
                ...(props.left !== undefined && { left: props.left }),
                ...(props.right !== undefined && { right: props.right }),
            }}
        >
        </View>
    );
}