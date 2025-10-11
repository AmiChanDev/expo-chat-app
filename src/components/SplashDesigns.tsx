import React from "react";
import { View } from "react-native";
import CircleShape from "./CircleShape";

// Design 1: Floating Bubbles
export const FloatingBubblesDesign = () => (
    <>
        <CircleShape
            width={200} height={200} borderRadius={100}
            fillColor="#3B82F6" top={-100} left={-50}
            animated={true} animationType="float" animationDelay={0}
            opacity={0.3}
        />
        <CircleShape
            width={150} height={150} borderRadius={75}
            fillColor="#8B5CF6" top={50} right={-75}
            animated={true} animationType="float" animationDelay={800}
            opacity={0.4}
        />
        <CircleShape
            width={120} height={120} borderRadius={60}
            fillColor="#06B6D4" bottom={-60} left={-30}
            animated={true} animationType="float" animationDelay={1200}
            opacity={0.3}
        />
        <CircleShape
            width={80} height={80} borderRadius={40}
            fillColor="#F59E0B" bottom={100} right={-40}
            animated={true} animationType="float" animationDelay={400}
            opacity={0.5}
        />
    </>
);

// Design 2: Pulsing Lights
export const PulsingLightsDesign = () => (
    <>
        <CircleShape
            width={300} height={300} borderRadius={150}
            fillColor="#3B82F6" top={-150} left={-150}
            animated={true} animationType="pulse" animationDelay={0}
            blur={true}
        />
        <CircleShape
            width={250} height={250} borderRadius={125}
            fillColor="#8B5CF6" top={50} right={-125}
            animated={true} animationType="pulse" animationDelay={600}
            blur={true}
        />
        <CircleShape
            width={200} height={200} borderRadius={100}
            fillColor="#06B6D4" bottom={-100} left={-100}
            animated={true} animationType="pulse" animationDelay={1200}
            blur={true}
        />
        <CircleShape
            width={150} height={150} borderRadius={75}
            fillColor="#F59E0B" bottom={50} right={-75}
            animated={true} animationType="pulse" animationDelay={300}
            blur={true}
        />
    </>
);

// Design 3: Rotating Rings
export const RotatingRingsDesign = () => (
    <>
        <CircleShape
            width={280} height={280} borderRadius={140}
            fillColor="transparent" top={-140} left={-140}
            borderWidth={3} borderColor="#3B82F6"
            animated={true} animationType="rotate" animationDelay={0}
            opacity={0.6}
        />
        <CircleShape
            width={220} height={220} borderRadius={110}
            fillColor="transparent" top={-110} left={-110}
            borderWidth={2} borderColor="#8B5CF6"
            animated={true} animationType="rotate" animationDelay={800}
            opacity={0.5}
        />
        <CircleShape
            width={160} height={160} borderRadius={80}
            fillColor="transparent" top={-80} left={-80}
            borderWidth={2} borderColor="#06B6D4"
            animated={true} animationType="rotate" animationDelay={1600}
            opacity={0.4}
        />
        <CircleShape
            width={100} height={100} borderRadius={50}
            fillColor="#F59E0B" top={-50} left={-50}
            animated={true} animationType="scale" animationDelay={2000}
            opacity={0.8}
        />
    </>
);

// Design 4: Glowing Orbs
export const GlowingOrbsDesign = () => (
    <>
        <CircleShape
            width={250} height={250} borderRadius={125}
            fillColor="#3B82F6" top={-125} left={-125}
            animated={true} animationType="glow" animationDelay={0}
            blur={true} opacity={0.4}
        />
        <CircleShape
            width={180} height={180} borderRadius={90}
            fillColor="#8B5CF6" top={-90} right={-90}
            animated={true} animationType="glow" animationDelay={800}
            blur={true} opacity={0.5}
        />
        <CircleShape
            width={200} height={200} borderRadius={100}
            fillColor="#06B6D4" bottom={-100} left={-100}
            animated={true} animationType="glow" animationDelay={1200}
            blur={true} opacity={0.4}
        />
        <CircleShape
            width={140} height={140} borderRadius={70}
            fillColor="#F59E0B" bottom={-70} right={-70}
            animated={true} animationType="glow" animationDelay={400}
            blur={true} opacity={0.6}
        />
    </>
);

// Design 5: Gradient Waves
export const GradientWavesDesign = () => (
    <>
        <CircleShape
            width={300} height={300} borderRadius={150}
            fillColor="#3B82F6" top={-150} left={-150}
            gradient={true}
            gradientColors={["#3B82F6", "#1E40AF", "#1E3A8A"]}
            animated={true} animationType="float" animationDelay={0}
        />
        <CircleShape
            width={250} height={250} borderRadius={125}
            fillColor="#8B5CF6" top={50} right={-125}
            gradient={true}
            gradientColors={["#8B5CF6", "#7C3AED", "#6D28D9"]}
            animated={true} animationType="float" animationDelay={600}
        />
        <CircleShape
            width={200} height={200} borderRadius={100}
            fillColor="#06B6D4" bottom={-100} left={-100}
            gradient={true}
            gradientColors={["#06B6D4", "#0891B2", "#0E7490"]}
            animated={true} animationType="float" animationDelay={1200}
        />
        <CircleShape
            width={150} height={150} borderRadius={75}
            fillColor="#F59E0B" bottom={50} right={-75}
            gradient={true}
            gradientColors={["#F59E0B", "#D97706", "#B45309"]}
            animated={true} animationType="float" animationDelay={800}
        />
    </>
);

// Design 6: Minimal Dots
export const MinimalDotsDesign = () => (
    <>
        <CircleShape
            width={60} height={60} borderRadius={30}
            fillColor="#3B82F6" top={100} left={50}
            animated={true} animationType="scale" animationDelay={0}
            opacity={0.8}
        />
        <CircleShape
            width={40} height={40} borderRadius={20}
            fillColor="#8B5CF6" top={200} right={80}
            animated={true} animationType="scale" animationDelay={400}
            opacity={0.7}
        />
        <CircleShape
            width={80} height={80} borderRadius={40}
            fillColor="#06B6D4" bottom={150} left={30}
            animated={true} animationType="scale" animationDelay={800}
            opacity={0.6}
        />
        <CircleShape
            width={50} height={50} borderRadius={25}
            fillColor="#F59E0B" bottom={80} right={60}
            animated={true} animationType="scale" animationDelay={1200}
            opacity={0.9}
        />
    </>
);