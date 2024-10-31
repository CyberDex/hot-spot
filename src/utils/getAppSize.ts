
export function getAppSize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const minWidth = 375;
    const minHeight = windowWidth > windowHeight ? 700 : 790;

    // Calculate renderer and canvas sizes based on current dimensions
    const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
    const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;

    const scale = scaleX > scaleY ? scaleX : scaleY;

    const width = windowWidth * scale;
    const height = windowHeight * scale;

    return { width, height };
}
