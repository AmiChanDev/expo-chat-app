import React from "react";
import { View } from "react-native";
import Animated, {
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    useAnimatedStyle,
    interpolate,
    withDelay,
    withSpring,
} from "react-native-reanimated";

type CircleProps = {
    width: number;
    height: number;
    borderRadius: number;
    fillColor: string;
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    // New animation and design props
    animated?: boolean;
    animationType?: 'pulse' | 'float' | 'rotate' | 'scale' | 'glow';
    animationDelay?: number;
    opacity?: number;
    borderWidth?: number;
    borderColor?: string;
    gradient?: boolean;
    gradientColors?: string[];
    blur?: boolean;
};

export default function CircleShape(props: CircleProps) {
    // Animation values
    const animationValue = useSharedValue(0);
    const rotationValue = useSharedValue(0);
    const scaleValue = useSharedValue(1);

    React.useEffect(() => {
        if (props.animated) {
            const delay = props.animationDelay || 0;

            switch (props.animationType) {
                case 'pulse':
                    animationValue.value = withDelay(delay, withRepeat(
                        withSequence(
                            withTiming(1, { duration: 1500 }),
                            withTiming(0, { duration: 1500 })
                        ),
                        -1,
                        true
                    ));
                    break;

                case 'float':
                    animationValue.value = withDelay(delay, withRepeat(
                        withSequence(
                            withTiming(-20, { duration: 2000 }),
                            withTiming(0, { duration: 2000 })
                        ),
                        -1,
                        true
                    ));
                    break;

                case 'rotate':
                    rotationValue.value = withDelay(delay, withRepeat(
                        withTiming(360, { duration: 4000 }),
                        -1,
                        false
                    ));
                    break;

                case 'scale':
                    scaleValue.value = withDelay(delay, withRepeat(
                        withSequence(
                            withSpring(1.2, { damping: 10 }),
                            withSpring(1, { damping: 10 })
                        ),
                        -1,
                        true
                    ));
                    break;

                case 'glow':
                    animationValue.value = withDelay(delay, withRepeat(
                        withSequence(
                            withTiming(1, { duration: 2000 }),
                            withTiming(0.3, { duration: 2000 })
                        ),
                        -1,
                        true
                    ));
                    break;
            }
        }
    }, [props.animated, props.animationType, props.animationDelay]);

    // Animated styles
    const animatedStyle = useAnimatedStyle(() => {
        let transform = [];
        let opacity = props.opacity || 1;

        switch (props.animationType) {
            case 'pulse':
                opacity = interpolate(animationValue.value, [0, 1], [0.3, 1]);
                break;

            case 'float':
                transform.push({ translateY: animationValue.value });
                break;

            case 'rotate':
                transform.push({ rotate: `${rotationValue.value}deg` });
                break;

            case 'scale':
                transform.push({ scale: scaleValue.value });
                break;

            case 'glow':
                opacity = interpolate(animationValue.value, [0, 1], [0.4, 1]);
                const scale = interpolate(animationValue.value, [0, 1], [1, 1.1]);
                transform.push({ scale });
                break;
        }

        return {
            opacity,
            transform,
        };
    });

    // Create gradient effect using multiple overlapping circles
    const renderGradientCircle = () => {
        if (!props.gradient || !props.gradientColors) {
            return null;
        }

        return props.gradientColors.map((color, index) => (
            <View
                key={index}
                style={{
                    position: "absolute",
                    width: props.width - (index * 10),
                    height: props.height - (index * 10),
                    borderRadius: props.borderRadius - (index * 5),
                    backgroundColor: color,
                    top: index * 5,
                    left: index * 5,
                    opacity: 0.8 - (index * 0.2),
                }}
            />
        ));
    };

    const baseStyle = {
        position: "absolute" as const,
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius,
        backgroundColor: props.fillColor,
        opacity: props.opacity || 1,
        ...(props.borderWidth && {
            borderWidth: props.borderWidth,
            borderColor: props.borderColor || '#ffffff',
        }),
        ...(props.blur && {
            shadowColor: props.fillColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 20,
            elevation: 10,
        }),
        ...(props.top !== undefined && { top: props.top }),
        ...(props.bottom !== undefined && { bottom: props.bottom }),
        ...(props.left !== undefined && { left: props.left }),
        ...(props.right !== undefined && { right: props.right }),
    };

    const CircleComponent = props.animated ? Animated.View : View;
    const circleStyle = props.animated ? [baseStyle, animatedStyle] : baseStyle;

    return (
        <CircleComponent style={circleStyle}>
            {props.gradient && renderGradientCircle()}
        </CircleComponent>
    );
}
